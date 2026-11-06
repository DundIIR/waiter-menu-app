'use client'

import { useEffect, useRef } from 'react'
import { useCategoryStore } from '@/store/category'

/**
 * Высота sticky TopBar: py-5 (40px) + строка категорий (44px + p-1).
 * Эта полоса сверху перекрыта, поэтому не считается видимой.
 * Под ней же прилипает блок фильтров.
 */
export const TOP_BAR_HEIGHT = 92

/** Все смонтированные секции категорий: id -> DOM-элемент */
const sections = new Map<number, HTMLElement>()

let subscribers = 0
let frame: number | null = null

/** Категория, которая занимает больше всего вертикального места на экране */
const getMostVisibleId = (): number | null => {
	const viewportTop = TOP_BAR_HEIGHT
	const viewportBottom = window.innerHeight

	let bestId: number | null = null
	let bestVisible = 0
	let lastVisibleId: number | null = null

	sections.forEach((el, id) => {
		const { top, bottom } = el.getBoundingClientRect()
		const visible = Math.min(bottom, viewportBottom) - Math.max(top, viewportTop)

		if (visible <= 0) return

		lastVisibleId = id

		if (visible > bestVisible) {
			bestVisible = visible
			bestId = id
		}
	})

	// В самом низу страницы последняя категория может быть короткой и никогда
	// не станет самой большой — подсвечиваем её принудительно
	const atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2

	return atBottom && lastVisibleId !== null ? lastVisibleId : bestId
}

const recalc = () => {
	if (frame !== null) return

	frame = requestAnimationFrame(() => {
		frame = null
		const id = getMostVisibleId()

		if (id !== null && id !== useCategoryStore.getState().activeId) {
			useCategoryStore.getState().setActiveId(id)
		}
	})
}

/**
 * Регистрирует секцию категории в общем наблюдателе.
 * Возвращает ref, который нужно повесить на корневой элемент секции.
 */
export const useActiveCategory = (categoryId: number) => {
	const ref = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const el = ref.current
		if (!el) return

		sections.set(categoryId, el)
		subscribers++

		if (subscribers === 1) {
			window.addEventListener('scroll', recalc, { passive: true })
			window.addEventListener('resize', recalc)
		}

		recalc()

		return () => {
			sections.delete(categoryId)
			subscribers--

			if (subscribers === 0) {
				window.removeEventListener('scroll', recalc)
				window.removeEventListener('resize', recalc)

				if (frame !== null) {
					cancelAnimationFrame(frame)
					frame = null
				}
			}
		}
	}, [categoryId])

	return ref
}
