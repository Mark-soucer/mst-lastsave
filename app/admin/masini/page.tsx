'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  Plus,
  Trash2,
  X,
  Upload,
  Loader2,
  Pencil,
} from 'lucide-react';
import AdminTabs from '@/components/admin/AdminTabs';
import type { CarRecord, CarStatus, CarCondition } from '@/lib/cars';

type CarFormState = {
  make: string;
  model: string;
  year: string;
  price: string;
  mileage: string;
  fuel: string;
  transmission: string;
  color: string;
  description: string;
  status: CarStatus;
  images: string[];
  hasVin: boolean;
  power: string;
  engineCapacity: string;
  doors: string;
  seats: string;
  paintType: string;
  firstRegistration: string;
  condition: CarCondition;
  features: string[];
};

const EMPTY_FORM: CarFormState = {
  make: '',
  model: '',
  year: '',
  price: '',
  mileage: '',
  fuel: 'Benzină',
  transmission: 'Manuală',
  color: '',
  description: '',
  status: 'disponibil',
  images: [],
  hasVin: true,
  power: '',
  engineCapacity: '',
  doors: '5',
  seats: '5',
  paintType: '',
  firstRegistration: '',
  condition: 'utilizat',
  features: [],
};

const STATUS_LABELS: Record<CarStatus, string> = {
  disponibil: 'Disponibilă',
  rezervat: 'Rezervată',
  vandut: 'Vândută',
};

function formatPrice(price: number) {
  return new Intl.NumberFormat('ro-RO').format(price) + ' €';
}

export default function AdminMasiniPage() {
  const [cars, setCars] = useState<CarRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CarFormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [featureInput, setFeatureInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchCars = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/cars', { cache: 'no-store' });
      const data = await res.json();
      if (data.success) setCars(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const openAddForm = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError(null);
    setFormOpen(true);
  };

  const openEditForm = (car: CarRecord) => {
    setEditingId(car.id);
    setForm({
      make: car.make,
      model: car.model,
      year: String(car.year),
      price: String(car.price),
      mileage: String(car.mileage),
      fuel: car.fuel,
      transmission: car.transmission,
      color: car.color || '',
      description: car.description || '',
      status: car.status,
      images: car.images,
      hasVin: car.hasVin,
      power: String(car.power || ''),
      engineCapacity: String(car.engineCapacity || ''),
      doors: String(car.doors || 5),
      seats: String(car.seats || 5),
      paintType: car.paintType || '',
      firstRegistration: car.firstRegistration || '',
      condition: car.condition,
      features: car.features || [],
    });
    setError(null);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditingId(null);
  };

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      Array.from(files).forEach((file) => formData.append('files', file));
      const res = await fetch('/api/cars/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.message || 'Încărcarea pozelor a eșuat.');
        return;
      }
      setForm((prev) => ({ ...prev, images: [...prev.images, ...data.urls] }));
    } catch (err) {
      console.error(err);
      setError('Încărcarea pozelor a eșuat.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeImage = (url: string) => {
    setForm((prev) => ({ ...prev, images: prev.images.filter((img) => img !== url) }));
  };

  const addFeature = () => {
    const value = featureInput.trim();
    if (!value) return;
    if (!form.features.includes(value)) {
      setForm((prev) => ({ ...prev, features: [...prev.features, value] }));
    }
    setFeatureInput('');
  };

  const removeFeature = (feature: string) => {
    setForm((prev) => ({ ...prev, features: prev.features.filter((f) => f !== feature) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.make || !form.model || !form.year || !form.price) {
      setError('Marca, modelul, anul și prețul sunt obligatorii.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        make: form.make,
        model: form.model,
        year: Number(form.year),
        price: Number(form.price),
        mileage: Number(form.mileage) || 0,
        fuel: form.fuel,
        transmission: form.transmission,
        color: form.color || undefined,
        description: form.description || undefined,
        status: form.status,
        images: form.images,
        hasVin: form.hasVin,
        power: Number(form.power) || 0,
        engineCapacity: Number(form.engineCapacity) || 0,
        doors: Number(form.doors) || 5,
        seats: Number(form.seats) || 5,
        paintType: form.paintType || undefined,
        firstRegistration: form.firstRegistration || undefined,
        condition: form.condition,
        features: form.features,
      };

      const res = editingId
        ? await fetch(`/api/cars/${editingId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          })
        : await fetch('/api/cars', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.message || 'Salvarea a eșuat.');
        return;
      }

      closeForm();
      fetchCars();
    } catch (err) {
      console.error(err);
      setError('Salvarea a eșuat.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Sigur dorești să ștergi această mașină?')) return;
    try {
      const res = await fetch(`/api/cars/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setCars((prev) => prev.filter((c) => c.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (id: string, status: CarStatus) => {
    try {
      const res = await fetch(`/api/cars/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        setCars((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#080808] text-white pt-24 pb-20 px-4 sm:px-6 lg:px-8 selection:bg-[#D50000] selection:text-white">
      <div
        className="pointer-events-none absolute left-1/4 top-10 h-[400px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(213,0,0,0.12),transparent_70%)] blur-3xl"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-7xl">
        <AdminTabs />

        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <Link
              href="/"
              className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-neutral-400 transition-all md:hover:border-[#FF1A1A]/50 md:hover:bg-white/10 md:hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5 transition-transform md:group-hover:-translate-x-1 text-[#FF1A1A]" />
              <span>Înapoi la site-ul principal</span>
            </Link>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Mașini de vânzare{' '}
              <span className="bg-gradient-to-r from-[#FF1A1A] via-[#ff4d4d] to-orange-500 bg-clip-text text-transparent">
                MST SERVICE
              </span>
            </h1>
          </div>

          <button
            onClick={openAddForm}
            className="inline-flex items-center gap-2 rounded-xl bg-[#FF1A1A] px-5 py-2.5 text-sm font-bold text-white shadow-[0_0_20px_rgba(255,26,26,0.35)] transition md:hover:bg-[#D50000]"
          >
            <Plus className="h-4 w-4" />
            Adaugă mașină
          </button>
        </div>

        {loading ? (
          <div className="flex items-center gap-2 text-neutral-400">
            <Loader2 className="h-4 w-4 animate-spin" /> Se încarcă...
          </div>
        ) : cars.length === 0 ? (
          <p className="text-neutral-400">Nicio mașină adăugată încă.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cars.map((car) => (
              <div key={car.id} className="overflow-hidden rounded-2xl border border-white/10 bg-neutral-900/60">
                <div className="relative aspect-[4/3] w-full bg-white/5">
                  {car.images[0] ? (
                    <Image src={car.images[0]} alt={`${car.make} ${car.model}`} fill className="object-cover" sizes="400px" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-neutral-500">Fără poză</div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold">
                    {car.make} {car.model} ({car.year})
                  </h3>
                  <p className="mt-1 text-xl font-bold text-[#FF1A1A]">{formatPrice(car.price)}</p>
                  <p className="mt-1 text-xs text-neutral-500">
                    {new Intl.NumberFormat('ro-RO').format(car.mileage)} km · {car.fuel} · {car.transmission}
                  </p>

                  <select
                    value={car.status}
                    onChange={(e) => handleStatusChange(car.id, e.target.value as CarStatus)}
                    className="mt-4 w-full rounded-lg border border-white/10 bg-neutral-800 px-3 py-2 text-sm text-white"
                  >
                    {Object.entries(STATUS_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>

                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => openEditForm(car)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white md:hover:bg-white/10"
                    >
                      <Pencil className="h-3.5 w-3.5" /> Editează
                    </button>
                    <button
                      onClick={() => handleDelete(car.id)}
                      className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-400 md:hover:bg-red-500/20"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Șterge
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-[#0c0c0c] p-6 sm:p-8">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">
                {editingId ? 'Editează mașina' : 'Adaugă mașină nouă'}
              </h2>
              <button onClick={closeForm} className="rounded-full p-1.5 text-neutral-400 md:hover:bg-white/10 md:hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            {error && (
              <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-neutral-400">Marcă *</label>
                  <input
                    value={form.make}
                    onChange={(e) => setForm({ ...form, make: e.target.value })}
                    className="w-full rounded-lg border border-white/10 bg-neutral-900 px-3 py-2.5 text-white"
                    placeholder="Volkswagen"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-neutral-400">Model *</label>
                  <input
                    value={form.model}
                    onChange={(e) => setForm({ ...form, model: e.target.value })}
                    className="w-full rounded-lg border border-white/10 bg-neutral-900 px-3 py-2.5 text-white"
                    placeholder="Golf 7"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-neutral-400">An *</label>
                  <input
                    type="number"
                    value={form.year}
                    onChange={(e) => setForm({ ...form, year: e.target.value })}
                    className="w-full rounded-lg border border-white/10 bg-neutral-900 px-3 py-2.5 text-white"
                    placeholder="2016"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-neutral-400">Preț (€) *</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full rounded-lg border border-white/10 bg-neutral-900 px-3 py-2.5 text-white"
                    placeholder="8500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-neutral-400">Kilometraj</label>
                  <input
                    type="number"
                    value={form.mileage}
                    onChange={(e) => setForm({ ...form, mileage: e.target.value })}
                    className="w-full rounded-lg border border-white/10 bg-neutral-900 px-3 py-2.5 text-white"
                    placeholder="145000"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-neutral-400">Culoare</label>
                  <input
                    value={form.color}
                    onChange={(e) => setForm({ ...form, color: e.target.value })}
                    className="w-full rounded-lg border border-white/10 bg-neutral-900 px-3 py-2.5 text-white"
                    placeholder="Negru"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-neutral-400">Combustibil</label>
                  <select
                    value={form.fuel}
                    onChange={(e) => setForm({ ...form, fuel: e.target.value })}
                    className="w-full rounded-lg border border-white/10 bg-neutral-900 px-3 py-2.5 text-white"
                  >
                    <option>Benzină</option>
                    <option>Diesel</option>
                    <option>Hibrid</option>
                    <option>Electric</option>
                    <option>GPL</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-neutral-400">Cutie</label>
                  <select
                    value={form.transmission}
                    onChange={(e) => setForm({ ...form, transmission: e.target.value })}
                    className="w-full rounded-lg border border-white/10 bg-neutral-900 px-3 py-2.5 text-white"
                  >
                    <option>Manuală</option>
                    <option>Automată</option>
                  </select>
                </div>
              </div>

              <div className="border-t border-white/10 pt-4">
                <p className="mb-3 text-xs font-bold uppercase tracking-wide text-[#FF1A1A]">Specificații</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-neutral-400">Are VIN (serie șasiu)</label>
                    <select
                      value={form.hasVin ? 'da' : 'nu'}
                      onChange={(e) => setForm({ ...form, hasVin: e.target.value === 'da' })}
                      className="w-full rounded-lg border border-white/10 bg-neutral-900 px-3 py-2.5 text-white"
                    >
                      <option value="da">Da</option>
                      <option value="nu">Nu</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-neutral-400">Stare</label>
                    <select
                      value={form.condition}
                      onChange={(e) => setForm({ ...form, condition: e.target.value as CarCondition })}
                      className="w-full rounded-lg border border-white/10 bg-neutral-900 px-3 py-2.5 text-white"
                    >
                      <option value="utilizat">Utilizat</option>
                      <option value="nou">Nou</option>
                    </select>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-neutral-400">Putere (CP)</label>
                    <input
                      type="number"
                      value={form.power}
                      onChange={(e) => setForm({ ...form, power: e.target.value })}
                      className="w-full rounded-lg border border-white/10 bg-neutral-900 px-3 py-2.5 text-white"
                      placeholder="150"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-neutral-400">Capacitate cilindrică (cm³)</label>
                    <input
                      type="number"
                      value={form.engineCapacity}
                      onChange={(e) => setForm({ ...form, engineCapacity: e.target.value })}
                      className="w-full rounded-lg border border-white/10 bg-neutral-900 px-3 py-2.5 text-white"
                      placeholder="1999"
                    />
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-neutral-400">Număr portiere</label>
                    <input
                      type="number"
                      value={form.doors}
                      onChange={(e) => setForm({ ...form, doors: e.target.value })}
                      className="w-full rounded-lg border border-white/10 bg-neutral-900 px-3 py-2.5 text-white"
                      placeholder="5"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-neutral-400">Număr locuri</label>
                    <input
                      type="number"
                      value={form.seats}
                      onChange={(e) => setForm({ ...form, seats: e.target.value })}
                      className="w-full rounded-lg border border-white/10 bg-neutral-900 px-3 py-2.5 text-white"
                      placeholder="5"
                    />
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-neutral-400">Opțiuni culoare</label>
                    <input
                      value={form.paintType}
                      onChange={(e) => setForm({ ...form, paintType: e.target.value })}
                      className="w-full rounded-lg border border-white/10 bg-neutral-900 px-3 py-2.5 text-white"
                      placeholder="Metalizată"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-neutral-400">Data primei înmatriculări</label>
                    <input
                      value={form.firstRegistration}
                      onChange={(e) => setForm({ ...form, firstRegistration: e.target.value })}
                      className="w-full rounded-lg border border-white/10 bg-neutral-900 px-3 py-2.5 text-white"
                      placeholder="1 septembrie 2017"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-neutral-400">Dotări</label>
                <div className="mb-3 flex flex-wrap gap-2">
                  {form.features.map((feature) => (
                    <span
                      key={feature}
                      className="inline-flex items-center gap-1.5 rounded-full border border-[#FF1A1A]/30 bg-[#FF1A1A]/10 px-3 py-1 text-xs font-medium text-white"
                    >
                      {feature}
                      <button type="button" onClick={() => removeFeature(feature)} className="text-neutral-400 md:hover:text-white">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addFeature();
                      }
                    }}
                    className="flex-1 rounded-lg border border-white/10 bg-neutral-900 px-3 py-2.5 text-white"
                    placeholder="ex: Scaune încălzite — Enter pentru a adăuga"
                  />
                  <button
                    type="button"
                    onClick={addFeature}
                    className="rounded-lg border border-white/10 bg-white/5 px-4 text-sm font-semibold text-white md:hover:bg-white/10"
                  >
                    Adaugă
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-neutral-400">Descriere</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full rounded-lg border border-white/10 bg-neutral-900 px-3 py-2.5 text-white"
                  placeholder="Detalii despre starea mașinii, dotări, istoric service..."
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-neutral-400">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as CarStatus })}
                  className="w-full rounded-lg border border-white/10 bg-neutral-900 px-3 py-2.5 text-white"
                >
                  {Object.entries(STATUS_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-neutral-400">Poze</label>
                <div className="mb-3 flex flex-wrap gap-3">
                  {form.images.map((img) => (
                    <div key={img} className="relative h-20 w-20 overflow-hidden rounded-lg border border-white/10">
                      <Image src={img} alt="" fill className="object-cover" sizes="80px" />
                      <button
                        type="button"
                        onClick={() => removeImage(img)}
                        className="absolute right-0.5 top-0.5 rounded-full bg-black/70 p-0.5 text-white md:hover:bg-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  multiple
                  onChange={(e) => handleUpload(e.target.files)}
                  className="hidden"
                  id="car-photo-upload"
                />
                <label
                  htmlFor="car-photo-upload"
                  className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-white/20 px-4 py-2.5 text-sm text-neutral-300 md:hover:border-[#FF1A1A]/50 md:hover:text-white"
                >
                  {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                  {uploading ? 'Se încarcă...' : 'Încarcă poze'}
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeForm}
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white md:hover:bg-white/10"
                >
                  Anulează
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF1A1A] px-4 py-3 text-sm font-bold text-white md:hover:bg-[#D50000] disabled:opacity-50"
                >
                  {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                  {editingId ? 'Salvează modificările' : 'Adaugă mașina'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
