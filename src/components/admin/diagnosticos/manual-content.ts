// Manual de uso de la pestaña "Cómo funciona". Para cambiar un texto, edítalo aquí:
// el componente ManualPanel solo lo muestra.

export type ManualBlock =
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[]; ordered?: boolean }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "important"; text: string };

export interface ManualSection {
  id: string;
  title: string;
  blocks: ManualBlock[];
}

export const MANUAL_TITLE = "Cómo funcionan las llamadas de diagnóstico";

export const MANUAL_INTRO =
  "Guía para el equipo: cómo llegan las citas, qué significa cada estado y qué hacer en cada caso. Todo se gestiona desde la pestaña Diagnósticos.";

export const MANUAL_SECTIONS: ManualSection[] = [
  {
    id: "horarios",
    title: "Horarios y agenda",
    blocks: [
      {
        type: "list",
        items: [
          "Cada llamada dura 15 minutos y es por Microsoft Teams. El enlace llega en el correo de Cal.com y aparece en el admin (botón \"Entrar a Teams\").",
          "Horario: lunes a viernes de 10:00 am a 2:30 pm hora de Houston, con una llamada cada 30 minutos. De marzo a octubre eso es de 9:00 am a 1:30 pm en CDMX; de noviembre a marzo, Houston y CDMX tienen la misma hora.",
          "La landing es solo para México: muestra los horarios en hora del centro de México y pide un WhatsApp de México (+52). En el admin la hora principal es la de Houston y la de CDMX aparece debajo; las vistas \"Hoy\" y \"Esta semana\" y el rango de fechas se cuentan en hora de Houston.",
          "En el día elegido se ven todos los horarios: los que ya están reservados o bloqueados en Cal.com aparecen en gris como \"Agendado\", igual que la franja de 3:00 a 5:30 pm (Houston). Los que ya pasaron o empiezan en menos de 2 horas no se muestran.",
          "La landing solo muestra los 2 días hábiles más próximos que tengan horarios libres. No cuenta fines de semana, festivos de México y Estados Unidos ni días llenos, y pide al menos 2 horas de anticipación.",
          "Cuando el cliente reprograma desde su correo de Cal.com ve exactamente lo mismo: solo esos 2 días hábiles. Los festivos están bloqueados en Cal.com y se cargan solos cada mes.",
          "Desde el admin (botón \"Reprogramar\") nosotros sí podemos mover una cita a cualquiera de los próximos 10 días hábiles, con las mismas horas y festivos.",
          "Cal.com le manda al cliente un recordatorio por correo 24 horas antes y otro 1 hora antes de la llamada.",
        ],
      },
    ],
  },
  {
    id: "estados",
    title: "Estados de una cita",
    blocks: [
      {
        type: "table",
        headers: ["Estado", "Qué significa", "Quién lo pone"],
        rows: [
          ["Agendada", "El cliente eligió horario en la landing. Falta que confirme por WhatsApp.", "Automático (landing)"],
          ["Confirmada", "El cliente mandó su WhatsApp \"CONFIRMO…\", o reprogramamos nosotros la cita.", "El equipo (\"Marcar confirmada\") o el admin al reprogramar"],
          ["Reprogramada", "El cliente cambió la fecha desde su correo de Cal.com. Hay que confirmar otra vez.", "Automático (Cal.com)"],
          ["Cancelada", "La cita ya no va: la canceló el cliente o la cancelamos nosotros.", "Automático (Cal.com) o el equipo (\"Cancelar cita\")"],
          ["Asistió / No asistió", "Resultado de la llamada.", "El equipo, después de la llamada"],
          ["Sin cita", "Llenó sus datos pero la reserva no se completó (por ejemplo, el horario se ocupó y no eligió otro).", "Automático (landing)"],
        ],
      },
    ],
  },
  {
    id: "rutina",
    title: "Rutina diaria",
    blocks: [
      {
        type: "list",
        ordered: true,
        items: [
          "Abre Diagnósticos → vista \"Hoy\": ahí están las llamadas del día en orden de hora, con el botón \"Entrar a Teams\".",
          "Revisa el resumen: \"Pendientes de confirmar\" y \"Alertas (< 3 h)\". Las alertas son citas sin confirmar que empiezan en menos de 3 horas y aparecen resaltadas en la lista.",
          "Cuando llegue un WhatsApp \"Hola, CONFIRMO mi llamada de diagnóstico…\", busca al cliente por nombre o teléfono, abre su ficha y toca \"Marcar confirmada\".",
          "Para escribirle al cliente usa los botones de WhatsApp de su ficha: \"Saludo\" o \"Recordatorio\". Abren WhatsApp con el mensaje listo, con la fecha y hora de México: \"(hora Centro de México)\", aunque el admin muestre la de Houston. Los recordatorios por correo (24 h y 1 h antes) los manda Cal.com solo; no hay que hacer nada.",
          "Después de cada llamada, marca \"Asistió\" o \"No asistió\".",
        ],
      },
    ],
  },
  {
    id: "cliente-cancela",
    title: "Cuando el cliente cancela",
    blocks: [
      {
        type: "paragraph",
        text: "El cliente puede cancelar desde el correo de Cal.com. La cita pasa sola a \"Cancelada\", el horario se libera para otra persona y desaparece de Outlook. No hay que hacer nada.",
      },
    ],
  },
  {
    id: "cliente-reprograma",
    title: "Cuando el cliente reprograma",
    blocks: [
      {
        type: "paragraph",
        text: "El cliente puede cambiar la fecha desde el correo de Cal.com; solo puede elegir entre los 2 días hábiles más próximos, igual que en la landing. La cita pasa sola a \"Reprogramada\", con la nueva fecha y un nuevo enlace de Teams. Hay que volver a confirmar: espera su WhatsApp (o escríbele con \"Saludo\") y toca \"Marcar confirmada\". Si necesita otra fecha más adelante, reprográmala tú desde el admin (hasta 10 días hábiles).",
      },
    ],
  },
  {
    id: "nosotros-reprogramamos",
    title: "Cuando nosotros reprogramamos",
    blocks: [
      {
        type: "list",
        ordered: true,
        items: [
          "Acuerda la nueva fecha con el cliente (por WhatsApp o llamada).",
          "En su ficha toca \"Reprogramar\" y elige el horario (próximos 10 días hábiles).",
          "Cal.com mueve la cita, genera un nuevo enlace de Teams, actualiza Outlook y le manda un correo al cliente. En el admin queda \"Confirmada\" y el cambio se guarda en el historial.",
        ],
      },
    ],
  },
  {
    id: "nosotros-cancelamos",
    title: "Cuando nosotros cancelamos",
    blocks: [
      {
        type: "paragraph",
        text: "En la ficha del cliente toca \"Cancelar cita\" y escribe el motivo. Se cancela en Cal.com, el horario se libera, desaparece de Outlook y el cliente recibe un correo con el aviso. En el admin queda \"Cancelada\".",
      },
    ],
  },
  {
    id: "reglas",
    title: "Reglas importantes",
    blocks: [
      {
        type: "important",
        text: "Nunca canceles ni muevas una cita directamente en Outlook: hazlo siempre desde el admin. Si se cambia en Outlook, Cal.com y el admin no se enteran.",
      },
      {
        type: "list",
        items: [
          "Si haces una prueba, abre su ficha y activa \"Es prueba\": así no cuenta en el resumen, en Origen ni en el CSV.",
          "La nota interna solo la ve el equipo; el cliente nunca la ve.",
          "Cada cambio de estado queda en el historial de la ficha, con quién lo hizo y cuándo.",
          "Si algo no cuadra con Cal.com, toca \"Sincronizar con Cal.com\". El admin también lo hace solo al abrir Diagnósticos (como máximo cada 5 minutos).",
        ],
      },
    ],
  },
  {
    id: "numeros",
    title: "Qué muestran los números",
    blocks: [
      {
        type: "table",
        headers: ["Dónde", "Qué muestra"],
        rows: [
          ["Resumen", "Citas de hoy y de esta semana, pendientes de confirmar, alertas (< 3 h), % de confirmación (citas que se confirmaron, sin contar canceladas), % de asistencia (asistió ÷ (asistió + no asistió)) y no asistieron."],
          ["Filtro País", "Cada lead guarda la landing por la que llegó. Hoy solo existe México; cuando haya landing de USA, el filtro separa los dos (también en el resumen y en Origen)."],
          ["Origen", "Citas por campaña y anuncio (utm_campaign y utm_content), con confirmadas, asistieron y % de asistencia. \"(sin UTM)\" agrupa las que no vinieron de un anuncio."],
          ["Exportar CSV", "La lista que estás viendo, con los filtros aplicados: datos de contacto, cita en Houston y CDMX, estado, las 7 respuestas (si eligió \"Otro\", aparece como \"Otro: lo que escribió\"), UTM, consentimientos y nota."],
        ],
      },
      {
        type: "paragraph",
        text: "El resumen y Origen nunca cuentan las pruebas y respetan el rango de fechas. El CSV deja fuera las pruebas mientras \"Ocultar pruebas\" esté activado.",
      },
    ],
  },
];
