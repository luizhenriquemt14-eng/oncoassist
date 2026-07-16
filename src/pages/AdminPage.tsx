import { useEffect, useMemo, useState } from "react";
import { Calendar, Pencil, Trash2, Upload, Users } from "lucide-react";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useEvents } from "@/hooks/use-events";
import { useProfessionals } from "@/contexts/ProfessionalsContext";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { useToast } from "@/hooks/use-toast";
import type { Event, EventFormValues, Professional } from "@/types/site";
import { getSupabase, restoreSupabaseAdminSession } from "@/lib/supabase";

const ACCEPTED_IMAGE_TYPES = "image/jpeg,image/png,image/webp,image/gif";

const emptyProfessional: Professional = {
  id: "",
  name: "",
  role: "",
  photo: "",
  showOnHome: true,
  curriculum: [],
  locations: [],
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

const toEventFormValues = (event: Event): EventFormValues => ({
  title: event.title,
  shortDescription: event.shortDescription,
  fullDescription: event.fullDescription,
  date: event.date,
  time: event.time,
  location: event.location,
  address: event.address,
  city: event.city,
  state: event.state,
  targetAudience: event.targetAudience,
  objective: event.objective,
  image: event.image,
  mobileImage: event.mobileImage ?? "",
  registrationEnabled: event.registrationEnabled !== false,
  schedule: (event.schedule || []).map((item) => ({
    time: item.time,
    title: item.title,
    speaker: item.speaker || "",
  })),
});

const uploadToStorage = async (file: File, folder: string) => {
  await restoreSupabaseAdminSession();

  const supabase = getSupabase();
  if (!supabase) {
    throw new Error("Supabase nao configurado.");
  }

  const extension = file.name.split(".").pop() || "bin";
  const path = `${folder}/${slugify(file.name.replace(/\.[a-z0-9]+$/i, ""))}-${crypto.randomUUID()}.${extension}`;

  const { error } = await supabase.storage.from("assets").upload(path, file, {
    upsert: true,
  });

  if (error) {
    throw error;
  }

  const { data } = supabase.storage.from("assets").getPublicUrl(path);
  return data.publicUrl;
};

const EventEditor = ({
  event,
  professionals,
  onSave,
  onDelete,
}: {
  event: Event;
  professionals: Professional[];
  onSave: (nextEvent: Event) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) => {
  const { toast } = useToast();
  const [form, setForm] = useState<EventFormValues>(() => toEventFormValues(event));
  const [selectedSpeakerIds, setSelectedSpeakerIds] = useState<string[]>(
    event.speakers.map((speaker) => speaker.id)
  );
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [mobileBannerFile, setMobileBannerFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const [isUploadingMobileBanner, setIsUploadingMobileBanner] = useState(false);

  useEffect(() => {
    setForm(toEventFormValues(event));
    setSelectedSpeakerIds(event.speakers.map((speaker) => speaker.id));
  }, [event]);

  const handleFieldChange = <K extends keyof EventFormValues>(name: K, value: EventFormValues[K]) => {
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleScheduleChange = (
    index: number,
    field: "time" | "title" | "speaker",
    value: string
  ) => {
    setForm((current) => ({
      ...current,
      schedule: current.schedule.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const toggleSpeaker = (professionalId: string) => {
    setSelectedSpeakerIds((current) =>
      current.includes(professionalId)
        ? current.filter((item) => item !== professionalId)
        : [...current, professionalId]
    );
  };

  const moveSpeaker = (index: number, direction: -1 | 1) => {
    setSelectedSpeakerIds((current) => {
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= current.length) {
        return current;
      }
      const next = [...current];
      const [item] = next.splice(index, 1);
      next.splice(targetIndex, 0, item);
      return next;
    });
  };

  const addScheduleItem = () => {
    setForm((current) => ({
      ...current,
      schedule: [...current.schedule, { time: "", title: "", speaker: "" }],
    }));
  };

  const removeScheduleItem = (index: number) => {
    setForm((current) => ({
      ...current,
      schedule: current.schedule.filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const handleUpload = async (kind: "desktop" | "mobile") => {
    const file = kind === "desktop" ? bannerFile : mobileBannerFile;
    if (!file) {
      toast({
        title: "Selecione uma imagem",
        description: "Escolha um arquivo antes de enviar.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (kind === "desktop") {
        setIsUploadingBanner(true);
      } else {
        setIsUploadingMobileBanner(true);
      }

      const folder =
        kind === "desktop" ? `events/${event.slug}` : `events/${event.slug}/mobile`;
      const publicUrl = await uploadToStorage(file, folder);
      handleFieldChange(kind === "desktop" ? "image" : "mobileImage", publicUrl);
      toast({
        title: "Imagem enviada!",
        description: "Salve o evento para persistir a alteracao.",
      });
    } catch (error) {
      toast({
        title: "Falha no upload",
        description: error instanceof Error ? error.message : "Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsUploadingBanner(false);
      setIsUploadingMobileBanner(false);
      setBannerFile(null);
      setMobileBannerFile(null);
    }
  };

  const handleSubmit = async (submitEvent: React.FormEvent) => {
    submitEvent.preventDefault();

    if (
      !form.title.trim() ||
      !form.shortDescription.trim() ||
      !form.fullDescription.trim() ||
      !form.date.trim() ||
      !form.time.trim() ||
      !form.location.trim() ||
      !form.city.trim() ||
      !form.state.trim()
    ) {
      toast({
        title: "Campos obrigatorios",
        description: "Preencha os campos principais antes de salvar.",
        variant: "destructive",
      });
      return;
    }

    const nextEvent: Event = {
      ...event,
      title: form.title.trim(),
      shortDescription: form.shortDescription.trim(),
      fullDescription: form.fullDescription.trim(),
      date: form.date.trim(),
      time: form.time.trim(),
      location: form.location.trim(),
      address: form.address.trim(),
      city: form.city.trim(),
      state: form.state.trim(),
      targetAudience: form.targetAudience.trim(),
      objective: form.objective.trim(),
      image: form.image.trim() || event.image,
      mobileImage: form.mobileImage.trim() || undefined,
      registrationEnabled: form.registrationEnabled,
      schedule: form.schedule
        .filter((item) => item.time.trim() || item.title.trim())
        .map((item) => ({
          time: item.time.trim(),
          title: item.title.trim(),
          speaker: item.speaker.trim() || null,
        })),
      speakers: selectedSpeakerIds
        .map((id) => professionals.find((item) => item.id === id))
        .filter((item): item is Professional => !!item)
        .map((professional) => ({
          id: professional.id,
          name: professional.name,
          role: professional.role || "",
          image: professional.photo,
        })),
    };

    try {
      setIsSaving(true);
      await onSave(nextEvent);
      toast({
        title: "Evento atualizado!",
        description: "As alteracoes foram salvas com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Nao foi possivel salvar",
        description: error instanceof Error ? error.message : "Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Tem certeza que deseja excluir este evento?")) {
      return;
    }

    try {
      setIsDeleting(true);
      await onDelete(event.id);
      toast({
        title: "Evento excluido!",
        description: "O evento foi removido com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Nao foi possivel excluir",
        description: error instanceof Error ? error.message : "Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Editar Evento</CardTitle>
        <CardDescription>{event.title}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>ID</Label>
              <Input value={event.id} readOnly disabled />
            </div>
            <div className="space-y-2">
              <Label>Slug</Label>
              <Input value={event.slug} readOnly disabled />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Titulo *</Label>
            <Input id="title" value={form.title} onChange={(event) => handleFieldChange("title", event.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="shortDescription">Descricao Curta *</Label>
            <Textarea
              id="shortDescription"
              rows={3}
              value={form.shortDescription}
              onChange={(event) => handleFieldChange("shortDescription", event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fullDescription">Descricao Completa *</Label>
            <Textarea
              id="fullDescription"
              rows={8}
              value={form.fullDescription}
              onChange={(event) => handleFieldChange("fullDescription", event.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Data *</Label>
              <Input id="date" value={form.date} onChange={(event) => handleFieldChange("date", event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Horario *</Label>
              <Input id="time" value={form.time} onChange={(event) => handleFieldChange("time", event.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="location">Local *</Label>
              <Input id="location" value={form.location} onChange={(event) => handleFieldChange("location", event.target.value)} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Endereco</Label>
              <Input id="address" value={form.address} onChange={(event) => handleFieldChange("address", event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">Cidade *</Label>
              <Input id="city" value={form.city} onChange={(event) => handleFieldChange("city", event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">Estado *</Label>
              <Input id="state" value={form.state} onChange={(event) => handleFieldChange("state", event.target.value)} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Banner</Label>
            <Input id="image" value={form.image} onChange={(event) => handleFieldChange("image", event.target.value)} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="bannerFile">Enviar novo banner</Label>
                <Input
                  id="bannerFile"
                  type="file"
                  accept={ACCEPTED_IMAGE_TYPES}
                  onChange={(event) => setBannerFile(event.target.files?.[0] ?? null)}
                />
              </div>
              <Button type="button" variant="outline" onClick={() => void handleUpload("desktop")} disabled={!bannerFile || isUploadingBanner}>
                <Upload className="w-4 h-4 mr-2" />
                {isUploadingBanner ? "Enviando..." : "Enviar"}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mobileImage">Banner Mobile</Label>
            <Input
              id="mobileImage"
              value={form.mobileImage}
              onChange={(event) => handleFieldChange("mobileImage", event.target.value)}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="mobileBannerFile">Enviar banner mobile</Label>
                <Input
                  id="mobileBannerFile"
                  type="file"
                  accept={ACCEPTED_IMAGE_TYPES}
                  onChange={(event) => setMobileBannerFile(event.target.files?.[0] ?? null)}
                />
              </div>
              <Button type="button" variant="outline" onClick={() => void handleUpload("mobile")} disabled={!mobileBannerFile || isUploadingMobileBanner}>
                <Upload className="w-4 h-4 mr-2" />
                {isUploadingMobileBanner ? "Enviando..." : "Enviar"}
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg border p-4">
            <input
              id="registrationEnabled"
              type="checkbox"
              checked={form.registrationEnabled}
              onChange={(event) => handleFieldChange("registrationEnabled", event.target.checked)}
            />
            <div className="space-y-1">
              <Label htmlFor="registrationEnabled">Inscricoes habilitadas</Label>
              <p className="text-sm text-muted-foreground">
                Desative para remover o formulario de inscricao da pagina do evento.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base">Palestrantes</Label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4 space-y-3">
                <p className="text-sm font-medium">Disponiveis</p>
                <div className="space-y-2 max-h-64 overflow-auto pr-2">
                  {professionals.map((professional) => (
                    <label key={professional.id} className="flex items-center gap-3 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedSpeakerIds.includes(professional.id)}
                        onChange={() => toggleSpeaker(professional.id)}
                      />
                      <span className="flex-1">
                        {professional.name}
                        {professional.role ? ` - ${professional.role}` : ""}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="border rounded-lg p-4 space-y-3">
                <p className="text-sm font-medium">Selecionados (ordem)</p>
                {selectedSpeakerIds.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Nenhum palestrante selecionado.</p>
                ) : (
                  <div className="space-y-2">
                    {selectedSpeakerIds.map((speakerId, index) => {
                      const professional = professionals.find((item) => item.id === speakerId);
                      return (
                        <div key={`${speakerId}-${index}`} className="flex items-center gap-2 text-sm">
                          <span className="flex-1">{professional?.name ?? speakerId}</span>
                          <Button type="button" variant="outline" size="sm" onClick={() => moveSpeaker(index, -1)} disabled={index === 0}>
                            ↑
                          </Button>
                          <Button type="button" variant="outline" size="sm" onClick={() => moveSpeaker(index, 1)} disabled={index === selectedSpeakerIds.length - 1}>
                            ↓
                          </Button>
                          <Button type="button" variant="destructive" size="sm" onClick={() => toggleSpeaker(speakerId)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetAudience">Publico-alvo</Label>
            <Textarea
              id="targetAudience"
              rows={3}
              value={form.targetAudience}
              onChange={(event) => handleFieldChange("targetAudience", event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="objective">Objetivo</Label>
            <Textarea
              id="objective"
              rows={3}
              value={form.objective}
              onChange={(event) => handleFieldChange("objective", event.target.value)}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base">Programacao</Label>
              <Button type="button" variant="outline" size="sm" onClick={addScheduleItem}>
                Adicionar item
              </Button>
            </div>
            {form.schedule.length === 0 && (
              <p className="text-sm text-muted-foreground">Nenhum item de programacao cadastrado.</p>
            )}
            <div className="space-y-4">
              {form.schedule.map((item, index) => (
                <div key={`schedule-${index}`} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Item {index + 1}</p>
                    <Button type="button" variant="destructive" size="sm" onClick={() => removeScheduleItem(index)}>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remover
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="space-y-2">
                      <Label>Horario</Label>
                      <Input value={item.time} onChange={(event) => handleScheduleChange(index, "time", event.target.value)} />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Titulo</Label>
                      <Input value={item.title} onChange={(event) => handleScheduleChange(index, "title", event.target.value)} />
                    </div>
                    <div className="space-y-2 md:col-span-3">
                      <Label>Palestrante (opcional)</Label>
                      <Input value={item.speaker} onChange={(event) => handleScheduleChange(index, "speaker", event.target.value)} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button type="submit" disabled={isSaving || isDeleting}>
              {isSaving ? "Salvando..." : "Salvar Alteracoes"}
            </Button>
            <Button type="button" variant="destructive" onClick={() => void handleDelete()} disabled={isDeleting || isSaving}>
              {isDeleting ? "Excluindo..." : "Excluir Evento"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

const ProfessionalsPanel = () => {
  const { professionals, upsertProfessional, deleteProfessional } = useProfessionals();
  const { toast } = useToast();
  const [selectedId, setSelectedId] = useState("");
  const [form, setForm] = useState<Professional>(emptyProfessional);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const selected = professionals.find((item) => item.id === selectedId);
    setForm(selected ?? emptyProfessional);
  }, [professionals, selectedId]);

  const resetForm = () => {
    setSelectedId("");
    setForm(emptyProfessional);
    setPhotoFile(null);
  };

  const handleUpload = async () => {
    if (!photoFile) {
      toast({
        title: "Selecione uma imagem",
        description: "Escolha um arquivo antes de enviar.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploading(true);
      const publicUrl = await uploadToStorage(photoFile, "profissionais");
      setForm((current) => ({ ...current, photo: publicUrl }));
      toast({
        title: "Foto enviada!",
        description: "Salve o profissional para aplicar a mudanca no site.",
      });
    } catch (error) {
      toast({
        title: "Falha no upload",
        description: error instanceof Error ? error.message : "Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setPhotoFile(null);
    }
  };

  const handleSave = async () => {
    const id = form.id.trim() || slugify(form.name);
    if (!id || !form.name.trim()) {
      toast({
        title: "Campos obrigatorios",
        description: "Preencha pelo menos o nome do profissional.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSaving(true);
      await upsertProfessional({
        ...form,
        id,
        name: form.name.trim(),
        role: form.role?.trim() || "",
        photo: form.photo.trim() || "/placeholder.svg",
      });
      setSelectedId(id);
      toast({
        title: "Profissional salvo!",
        description: "Atualizado com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Nao foi possivel salvar",
        description: error instanceof Error ? error.message : "Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!form.id.trim()) {
      return;
    }

    if (!window.confirm("Excluir este profissional? Isso remove ele dos eventos tambem.")) {
      return;
    }

    try {
      setIsDeleting(true);
      await deleteProfessional(form.id.trim());
      resetForm();
      toast({
        title: "Profissional excluido!",
        description: "Removido com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Nao foi possivel excluir",
        description: error instanceof Error ? error.message : "Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="text-lg">Profissionais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 max-h-[70vh] overflow-auto pr-2">
          {professionals.map((professional) => (
            <Button
              key={professional.id}
              type="button"
              variant={professional.id === selectedId ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setSelectedId(professional.id)}
            >
              {professional.name}
            </Button>
          ))}
        </CardContent>
        <CardFooter>
          <Button type="button" variant="outline" className="w-full" onClick={resetForm}>
            Novo profissional
          </Button>
        </CardFooter>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg">
            {selectedId ? `Editar: ${form.name}` : "Novo profissional"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>ID (opcional)</Label>
              <Input value={form.id} onChange={(event) => setForm((current) => ({ ...current, id: event.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Nome *</Label>
              <Input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Cargo</Label>
              <Input value={form.role || ""} onChange={(event) => setForm((current) => ({ ...current, role: event.target.value }))} />
            </div>
            <div className="flex items-center gap-3 md:col-span-2 pt-2">
              <input
                id="showOnHome"
                type="checkbox"
                checked={form.showOnHome !== false}
                onChange={(event) => setForm((current) => ({ ...current, showOnHome: event.target.checked }))}
              />
              <Label htmlFor="showOnHome">Mostrar na Home (Nossa Equipe)</Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Foto (URL)</Label>
            <Input value={form.photo} onChange={(event) => setForm((current) => ({ ...current, photo: event.target.value }))} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
              <div className="space-y-2 md:col-span-2">
                <Label>Enviar foto</Label>
                <Input type="file" accept={ACCEPTED_IMAGE_TYPES} onChange={(event) => setPhotoFile(event.target.files?.[0] ?? null)} />
              </div>
              <Button type="button" variant="outline" onClick={() => void handleUpload()} disabled={!photoFile || isUploading}>
                <Upload className="w-4 h-4 mr-2" />
                {isUploading ? "Enviando..." : "Enviar"}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Curriculo (1 linha por item)</Label>
            <Textarea
              rows={6}
              value={form.curriculum.join("\n")}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  curriculum: event.target.value.split("\n").map((item) => item.trim()).filter(Boolean),
                }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Locais (JSON)</Label>
            <Textarea
              rows={6}
              value={JSON.stringify(form.locations, null, 2)}
              onChange={(event) => {
                try {
                  setForm((current) => ({
                    ...current,
                    locations: JSON.parse(event.target.value),
                  }));
                } catch {
                  // Ignore invalid JSON until save
                }
              }}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-3">
          <Button type="button" onClick={() => void handleSave()} disabled={isSaving || isDeleting}>
            {isSaving ? "Salvando..." : "Salvar"}
          </Button>
          <Button type="button" variant="destructive" onClick={() => void handleDelete()} disabled={isDeleting || isSaving || !form.id.trim()}>
            {isDeleting ? "Excluindo..." : "Excluir"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

const AdminPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated, logout } = useAdminAuth();
  const { events, updateEvent, deleteEvent } = useEvents();
  const { professionals } = useProfessionals();
  const currentTab = searchParams.get("tab") || "events";
  const currentEventSlug = searchParams.get("event") || "";
  const selectedEvent = useMemo(
    () => events.find((event) => event.slug === currentEventSlug) || null,
    [currentEventSlug, events]
  );

  useEffect(() => {
    if (!searchParams.get("tab")) {
      setSearchParams(new URLSearchParams({ tab: "events" }), { replace: true });
    }
  }, [searchParams, setSearchParams]);

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  const switchTab = (tab: string) => {
    const next = new URLSearchParams(searchParams);
    next.set("tab", tab);
    if (tab !== "events") {
      next.delete("event");
    }
    setSearchParams(next);
  };

  const startEditingEvent = (slug: string) => {
    const next = new URLSearchParams(searchParams);
    next.set("tab", "events");
    next.set("event", slug);
    setSearchParams(next);
  };

  const stopEditingEvent = () => {
    const next = new URLSearchParams(searchParams);
    next.delete("event");
    setSearchParams(next);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="pt-16 lg:pt-20 flex-1">
        <section className="relative py-10 lg:py-12 overflow-hidden">
          <div className="absolute inset-0 hero-gradient" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto">
              <h1 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-2">
                Painel Administrativo
              </h1>
              <p className="text-primary-foreground/80">
                Edite eventos e profissionais. Mudancas aparecem no site sem precisar de novo deploy.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                <Button type="button" variant={currentTab === "events" ? "secondary" : "outline"} onClick={() => switchTab("events")}>
                  <Calendar className="w-4 h-4 mr-2" />
                  Eventos
                </Button>
                <Button type="button" variant={currentTab === "professionals" ? "secondary" : "outline"} onClick={() => switchTab("professionals")}>
                  <Users className="w-4 h-4 mr-2" />
                  Profissionais
                </Button>
                <Button type="button" variant="outline" onClick={() => void logout()}>
                  Sair
                </Button>
              </div>
            </div>
          </div>
        </section>

        {currentTab === "events" && (
          <section className="py-10">
            <div className="container mx-auto px-4">
              {selectedEvent ? (
                <div className="max-w-5xl mx-auto space-y-6">
                  <Button type="button" variant="outline" size="sm" onClick={stopEditingEvent}>
                    Voltar para lista de eventos
                  </Button>
                  <EventEditor
                    event={selectedEvent}
                    professionals={professionals}
                    onSave={async (nextEvent) => {
                      await updateEvent(selectedEvent.id, nextEvent);
                    }}
                    onDelete={async (id) => {
                      await deleteEvent(id);
                      navigate("/admin?tab=events", { replace: true });
                    }}
                  />
                </div>
              ) : (
                <div className="max-w-6xl mx-auto">
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="font-display text-2xl font-bold text-foreground">Eventos</h2>
                    <p className="text-sm text-muted-foreground">
                      Profissionais cadastrados: {professionals.length}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map((event) => (
                      <Card key={event.id} className="flex flex-col">
                        <CardHeader>
                          <CardTitle className="text-lg line-clamp-2">{event.title}</CardTitle>
                          <CardDescription className="line-clamp-2">
                            {event.shortDescription}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            <span>{event.date}</span>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button className="w-full" variant="outline" onClick={() => startEditingEvent(event.slug)}>
                            <Pencil className="w-4 h-4 mr-2" />
                            Editar
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {currentTab === "professionals" && (
          <section className="py-10">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <ProfessionalsPanel />
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default AdminPage;
