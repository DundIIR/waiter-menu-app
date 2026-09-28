'use client'

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'
import { Loader } from 'lucide-react'

const buttonVariants = cva(
	// disabled-стили заданы по вариантам, а не в базе: серая заливка поверх
	// прозрачной кнопки с обводкой выглядела грязно.
	// Вместо pointer-events-none — cursor-not-allowed: иначе курсор над
	// выключенной кнопкой не меняется вообще. Клики и так не проходят
	// (нативный disabled), а hover/active гасим через not-disabled
	'inline-flex items-center justify-center whitespace-nowrap rounded-md not-disabled:active:translate-y-[1px] text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed',
	{
		variants: {
			variant: {
				default:
					'bg-primary text-primary-foreground not-disabled:hover:bg-primary/90 disabled:bg-gray-500 disabled:opacity-50',
				destructive:
					'bg-destructive text-destructive-foreground not-disabled:hover:bg-destructive/90 disabled:opacity-50',
				outline:
					'border border-primary text-primary bg-transparent not-disabled:hover:bg-secondary disabled:bg-primary/5 disabled:border-primary/30 disabled:text-primary/50',
				secondary:
					'bg-secondary text-primary not-disabled:hover:bg-secondary/50 disabled:opacity-50',
				ghost:
					'not-disabled:hover:bg-secondary not-disabled:hover:text-secondary-foreground disabled:opacity-50',
				link: 'text-primary underline-offset-4 not-disabled:hover:underline disabled:opacity-50',
			},
			size: {
				default: 'h-10 px-4 py-2',
				sm: 'h-9 rounded-md px-3',
				lg: 'h-11 rounded-md px-8',
				icon: 'h-10 w-10',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	},
)

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean
	loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant, size, asChild = false, children, disabled, loading, ...props }, ref) => {
		const Comp = asChild ? Slot : 'button'
		return (
			<Comp
				disabled={disabled || loading}
				className={cn(buttonVariants({ variant, size, className }))}
				ref={ref}
				{...props}>
				{!loading ? children : <Loader className="w-5 h-5 animate-spin" />}
			</Comp>
		)
	},
)
Button.displayName = 'Button'

export { Button, buttonVariants }
