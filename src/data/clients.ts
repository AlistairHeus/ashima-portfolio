/**
 * Client marks for the home marquee.
 * Files live in `public/logos`.
 */
export interface ClientLogo {
	readonly src: string;
	readonly alt: string;
}

export const clientLogos: readonly ClientLogo[] = [
	{ src: '/logos/aanee.png', alt: 'Aanee' },
	{ src: '/logos/air-india.png', alt: 'Air India' },
	{ src: '/logos/akzo-nobel.png', alt: 'AkzoNobel' },
	{ src: '/logos/alkazi-foundation.png', alt: 'The Alkazi Foundation for the Arts' },
	{ src: '/logos/ashirvad.png', alt: 'Ashirvad' },
	{ src: '/logos/baxter.png', alt: 'Baxter' },
	{ src: '/logos/igl.png', alt: 'IGL' },
	{ src: '/logos/ikd.png', alt: 'Ishan Khosla Design' },
	{ src: '/logos/institut-francais.png', alt: 'Institut Français' },
	{ src: '/logos/lvpei.png', alt: 'LV Prasad Eye Institute' },
	{ src: '/logos/Royal-Enfield-Logo.png', alt: 'Royal Enfield' },
	{ src: '/logos/schneider.png', alt: 'Schneider Electric' },
	{ src: '/logos/sewa.png', alt: 'SEWA' },
	{ src: '/logos/tata-elxsi.png', alt: 'Tata Elxsi' },
	{ src: '/logos/tata.png', alt: 'Tata' },
	{ src: '/logos/transtron.png', alt: 'Transtron' },
	{ src: '/logos/tsi.png', alt: 'TSi Power' },
	{ src: '/logos/uttarakhand-gov.png', alt: 'Government of Uttarakhand' },
	{ src: '/logos/vivan.png', alt: 'Vivan Super Speciality Hospital' },
] as const;
