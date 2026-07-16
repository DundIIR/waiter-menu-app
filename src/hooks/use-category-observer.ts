import { useEffect } from 'react'
import { useCategoryStore } from '@/store/category'

export function useCategoryObserver(
	categoryId: number,
	ref: React.RefObject<HTMLDivElement | null>,
) {
	const { setActiveId } = useCategoryStore()

	useEffect(() => {
		if (ref && ref.current) {
			const observer = new IntersectionObserver(
				entries => {
					entries.forEach(entry => {
						if (entry.isIntersecting) {
							// берем top относительно viewport
							const top = entry.boundingClientRect.top

							// обновляем activeId только если эта секция ближе всего к верху
							// (можно хранить глобально последнее значение)
							if (top >= 0 && top < window.innerHeight / 2) {
								setActiveId(categoryId)
							}
						}
					})
				},
				{
					root: null,
					threshold: [0, 0.25, 0.5, 0.75, 1],
				},
			)

			observer.observe(ref.current)

			return () => {
				if (ref.current) {
					observer.unobserve(ref.current)
				}
			}
		}
	}, [ref, categoryId, setActiveId])
}
