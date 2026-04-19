const REMINDER_ALARM = 'feasty-reminder-tick';
const SYNC_ALARM = 'feasty-sync-tick';

chrome.runtime.onInstalled.addListener(async () => {
  await chrome.alarms.create(REMINDER_ALARM, { periodInMinutes: 1 });
  await chrome.alarms.create(SYNC_ALARM, { periodInMinutes: 30 });
  try {
    await (chrome as any).sidePanel?.setPanelBehavior?.({ openPanelOnActionClick: false });
  } catch {
    /* not always available */
  }
});

chrome.runtime.onStartup.addListener(async () => {
  await chrome.alarms.create(REMINDER_ALARM, { periodInMinutes: 1 });
});

type ReminderShape = {
  _id: string;
  kind: string;
  hour: number;
  minute: number;
  days: number[];
  enabled: boolean;
  text?: string;
};

const messageFor = (kind: string, text?: string) => {
  if (text && text.trim().length > 0) return text;
  switch (kind) {
    case 'water':
      return 'hydration check! sip sip 💧';
    case 'meal':
      return 'lil reminder to log that meal 🍽';
    case 'weight':
      return 'wanna weigh in today? all good either way';
    case 'workout':
      return 'time to move a bit 💪';
    default:
      return 'feasty nudge';
  }
};

const fireReminders = async () => {
  const { 'feasty.token': token, 'feasty.reminders': cached } = await chrome.storage.local.get([
    'feasty.token',
    'feasty.reminders',
  ]);
  if (!token) return;
  let reminders: ReminderShape[] = cached ?? [];
  // refresh every 5 min so changes show up
  const now = new Date();
  if (!cached || now.getMinutes() % 5 === 0) {
    try {
      const res = await fetch('http://localhost:3001/api/reminder', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        reminders = await res.json();
        await chrome.storage.local.set({ 'feasty.reminders': reminders });
      }
    } catch {
      /* offline ok */
    }
  }
  const hour = now.getHours();
  const minute = now.getMinutes();
  const day = now.getDay();
  for (const r of reminders) {
    if (!r.enabled) continue;
    if (r.hour !== hour || r.minute !== minute) continue;
    if (!r.days.includes(day)) continue;
    chrome.notifications.create(`feasty-${r._id}-${Date.now()}`, {
      type: 'basic',
      iconUrl: 'icons/feasty-128.png',
      title: 'feasty',
      message: messageFor(r.kind, r.text),
      priority: 1,
    });
  }
};

const touchStreak = async () => {
  const { 'feasty.token': token } = await chrome.storage.local.get('feasty.token');
  if (!token) return;
  try {
    await fetch('http://localhost:3001/api/streak/touch', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch {
    /* offline ok */
  }
};

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === REMINDER_ALARM) await fireReminders();
  if (alarm.name === SYNC_ALARM) await touchStreak();
});

chrome.notifications.onClicked.addListener(async (notificationId) => {
  if (notificationId.startsWith('feasty-')) {
    const tab = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab[0]?.windowId != null) {
      try {
        await (chrome as any).sidePanel?.open?.({ windowId: tab[0].windowId });
      } catch {
        /* noop */
      }
    }
  }
});

chrome.action.onClicked.addListener(async (tab) => {
  if (tab.windowId != null) {
    try {
      await (chrome as any).sidePanel?.open?.({ windowId: tab.windowId });
    } catch {
      /* fallback to popup */
    }
  }
});
