import { NextRequest, NextResponse } from 'next/server';
import {
  getAppointments,
  saveAppointment,
  updateAppointmentStatus,
  proposeAppointmentReschedule,
  confirmAppointment,
  confirmByClient,
  cancelAppointment,
  deleteAppointment,
} from '@/lib/db';
import { APPOINTMENT_STATUSES, type AppointmentState } from '@/lib/repair-orders/types';
export const dynamic = 'force-dynamic';

// GET - Listează toate programările
export async function GET() {
  try {
    const appointments = await getAppointments();
    return NextResponse.json({ success: true, data: appointments });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Eroare la citirea programărilor.' },
      { status: 500 }
    );
  }
}

// POST - Creează o programare nouă salvată în baza de date
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { service, carModel, carYear, date, time, name, phone, notes } = body;

    if (!name || !phone || !service || !date || !time) {
      return NextResponse.json(
        { success: false, message: 'Toate câmpurile obligatorii trebuie completate.' },
        { status: 400 }
      );
    }

    const saved = await saveAppointment({
      service,
      carModel: carModel || 'Nespecificat',
      carYear: carYear || '',
      date,
      time,
      name,
      phone,
      notes: notes || '',
    });

    return NextResponse.json({ success: true, data: saved }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Nu s-a putut salva programarea.' },
      { status: 500 }
    );
  }
}

// PATCH - Actualizează o programare:
//   { id, status }                -> schimbă statusul direct (admin)
//   { id, action: 'confirm' }     -> confirmă ora curentă sau ora propusă
//   { id, action: 'propose', ...} -> propune o reprogramare
//   { id, action: 'cancel' }      -> anulează programarea
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, action, proposedDate, proposedTime, proposalMessage } = body;
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'ID-ul programării este obligatoriu.' },
        { status: 400 }
      );
    }

    if (action === 'confirm') {
      const ok = await confirmAppointment(id);
      if (!ok) {
        return NextResponse.json(
          { success: false, message: 'Programarea nu a fost găsită.' },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, message: 'Programare aprobată. Se așteaptă confirmarea clientului.' });
    }

    if (action === 'confirm-client') {
      const ok = await confirmByClient(id);
      if (!ok) {
        return NextResponse.json(
          { success: false, message: 'Programarea nu a fost găsită.' },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, message: 'Programare confirmată de client.' });
    }

    if (action === 'propose') {
      if (!proposedDate || !proposedTime) {
        return NextResponse.json(
          { success: false, message: 'Data și ora propuse sunt obligatorii.' },
          { status: 400 }
        );
      }

      const ok = await proposeAppointmentReschedule(id, proposedDate, proposedTime, proposalMessage);
      if (!ok) {
        return NextResponse.json(
          { success: false, message: 'Programarea nu a fost găsită.' },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, message: 'Reprogramare propusă cu succes.' });
    }

    if (action === 'cancel') {
      const ok = await cancelAppointment(id);
      if (!ok) {
        return NextResponse.json(
          { success: false, message: 'Programarea nu a fost găsită.' },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, message: 'Programare anulată.' });
    }

    if (!status) {
      return NextResponse.json(
        { success: false, message: 'Statusul este obligatoriu.' },
        { status: 400 }
      );
    }

    if (!APPOINTMENT_STATUSES.includes(status as AppointmentState)) {
      return NextResponse.json(
        { success: false, message: 'Statusul trimis este invalid.' },
        { status: 400 }
      );
    }

    const ok = await updateAppointmentStatus(id, status);
    if (!ok) {
      return NextResponse.json(
        { success: false, message: 'Programarea nu a fost găsită.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Status actualizat cu succes.' });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Eroare la actualizare.' },
      { status: 500 }
    );
  }
}

// DELETE - Șterge o programare
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'ID lipsă.' },
        { status: 400 }
      );
    }

    const ok = await deleteAppointment(id);
    if (!ok) {
      return NextResponse.json(
        { success: false, message: 'Programarea nu a fost găsită.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Programare ștearsă cu succes.' });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Eroare la ștergere.' },
      { status: 500 }
    );
  }
}

