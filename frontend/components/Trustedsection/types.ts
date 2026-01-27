export interface TrustLogo {
    id: number;
    url: string;
    alternativeText: string | null;
    width: number;
    height: number;
}

export interface TrustedSectionData {
    id: number;
    Title?: string;
    Trustlist: {
        id: number;
        Icon: TrustLogo;
        Title: string;
        Description: string;
    }[];
}

export interface TrustedSectionProps {
    data: TrustedSectionData | null;
}
