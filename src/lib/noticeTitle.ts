import {
  BellRing,
  CalendarDays,
  GraduationCap,
  Newspaper,
  BookOpenText,
} from 'lucide-react'

export const noticeTitles = [
  { i: 1, title: 'News', type: 'news', icon: Newspaper },
  { i: 3, title: 'Events', type: 'news', icon: CalendarDays },
  { i: 2, title: 'General Notices', type: 'notice', icon: BellRing },
  { i: 5, title: 'Academic Notices', type: 'notice', icon: GraduationCap },
  // { i: 4, title: 'Journal Archives', type: 'others', icon: BookOpenText },
]

export function noticeTitle(id: number) {
  const notice = noticeTitles.find((t) => t.i === id)
  return notice ? notice.title : 'Unknown'
}
