import React from 'react';
import Image from 'next/image';
import './Trustedsection.scss';
import { TrustedSectionProps } from './types';
import { getStrapiURL } from '@/lib/strapi';

const Trustedsection: React.FC<TrustedSectionProps> = ({ data }) => {
    if (!data) return null;
    const { Title, Trustlist } = data;

    return (
        <section className="trusted-section">
            <div className="trusted-container">
                {Title && <h3 className="trusted-title">{Title}</h3>}

                {Trustlist && Trustlist.length > 0 && (
                    <div className="trust-list">
                        {Trustlist.map((item) => {
                            if (!item.Icon) return null;

                            const imageUrl = item.Icon.url.startsWith('http')
                                ? item.Icon.url
                                : getStrapiURL(item.Icon.url);

                            return (
                                <div key={item.id} className="trust-item">
                                    <div className="trust-icon-wrapper">
                                        <Image
                                            src={imageUrl}
                                            alt={item.Icon.alternativeText || item.Title || 'Trusted Partner'}
                                            width={item.Icon.width || 150}
                                            height={item.Icon.height || 50}
                                            className="trust-image"
                                            unoptimized={true} // Simplify for Strapi images initially
                                        />
                                    </div>
                                    <div className="trust-content">
                                        {item.Title && <h4 className="trust-item-title">{item.Title}</h4>}
                                        {item.Description && <p className="trust-item-desc">{item.Description}</p>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
};

export default Trustedsection;
