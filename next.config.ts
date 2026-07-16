import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	images: {
		domains: ['media.dodostatic.net'], // разрешаем картинки с этого домена
	},
}

export default nextConfig
