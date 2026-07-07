import { supabase, isSupabaseConfigured } from './supabase'

const STORAGE_PREFIX = 'vatual_progress_'

function localKey(userId) {
  return `${STORAGE_PREFIX}${userId}`
}

function readLocal(userId) {
  try {
    return JSON.parse(localStorage.getItem(localKey(userId))) ?? {}
  } catch {
    return {}
  }
}

function writeLocal(userId, progress) {
  localStorage.setItem(localKey(userId), JSON.stringify(progress))
}

// Fetch all practical progress for a user, keyed by practical slug:
// { [slug]: { reflection: string, completedAt: string } }
export async function getProgress(userId) {
  if (!userId) return {}

  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('practical_progress')
      .select('slug, reflection, completed_at')
      .eq('user_id', userId)
    if (error) throw error
    return Object.fromEntries(
      data.map((row) => [row.slug, { reflection: row.reflection, completedAt: row.completed_at }])
    )
  }

  return readLocal(userId)
}

// Save a student's reflection for a practical and mark it complete.
export async function saveReflection(userId, slug, reflection) {
  if (!userId) return
  const completedAt = new Date().toISOString()

  if (isSupabaseConfigured) {
    const { error } = await supabase
      .from('practical_progress')
      .upsert(
        { user_id: userId, slug, reflection, completed_at: completedAt },
        { onConflict: 'user_id,slug' }
      )
    if (error) throw error
    return { reflection, completedAt }
  }

  const progress = readLocal(userId)
  progress[slug] = { reflection, completedAt }
  writeLocal(userId, progress)
  return progress[slug]
}
