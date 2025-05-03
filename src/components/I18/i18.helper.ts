import i18next from './i18n'

export const fallbackLng = 'he'
export const languages = [fallbackLng, 'en', 'ar']
export const defaultNS = 'translation'
export const cookieName = 'i18next'
export const headerName = 'x-i18next-current-language'

export async function getT(ns: string = defaultNS, options: any = {}, req: any = null) {
  const lng = req?.headers[headerName]
  if (lng && i18next.resolvedLanguage !== lng) {
    await i18next.changeLanguage(lng)
  }
  if (ns && !i18next.hasLoadedNamespace(ns)) {
    await i18next.loadNamespaces(ns)
  }
  return {
    t: i18next.getFixedT(lng ?? i18next.resolvedLanguage ?? fallbackLng, Array.isArray(ns) ? ns[0] : ns, options?.keyPrefix),
    i18n: i18next
  }
}