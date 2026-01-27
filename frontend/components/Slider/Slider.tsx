"use client";

import React, { useState, useEffect } from 'react';
import { CaretLeft, CaretRight } from '@phosphor-icons/react';
import './Slider.scss';
import { SliderProps, SliderImage } from './types';

const Slider: React.FC<SliderProps> = ({ items }) => {
    // console.log("Slider Items Received:", JSON.stringify(items, null, 2));
    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-slide logic
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
        }, 8000); // 8000ms as per reference

        return () => clearInterval(interval);
    }, [items.length]);

    const goToSlide = (index: number) => {
        if (index < 0) {
            setCurrentIndex(items.length - 1);
        } else if (index >= items.length) {
            setCurrentIndex(0);
        } else {
            setCurrentIndex(index);
        }
    };

    const nextSlide = () => {
        goToSlide(currentIndex + 1);
    };

    const prevSlide = () => {
        goToSlide(currentIndex - 1);
    };

    if (!items || items.length === 0) return null;

    const isFirstSlide = currentIndex === 0;
    const isLastSlide = currentIndex === items.length - 1;

    return (
        <div className="carousel-container">


            <div className="carousel-slides">
                {items.map((item, index) => {
                    const getImgUrl = (img: SliderImage | undefined | null) => {
                        if (!img || !img.url) return "";
                        const url = img.url;
                        if (url.startsWith('http')) return url;
                        // Ensure leading slash
                        const cleanUrl = url.startsWith('/') ? url : `/${url}`;
                        return `http://localhost:1337${cleanUrl}`;
                    };

                    const desktopSrc = getImgUrl(item.Desktopimages) || getImgUrl(item.Images);
                    const mobileSrc = getImgUrl(item.Mobileimages) || getImgUrl(item.Images) || desktopSrc;



                    return (
                        <div
                            key={item.id}
                            className={`carousel-slide ${index === currentIndex ? 'active' : ''}`}
                        >
                            {/* Desktop Background Helper */}
                            {desktopSrc && (
                                <div
                                    className="slide-background"
                                    style={{
                                        backgroundImage: `url('${desktopSrc}')`
                                    }}
                                />
                            )}

                            {/* Mobile Image: Render Img if src exists, else Placeholder Div */}
                            {mobileSrc ? (
                                <img
                                    src={mobileSrc}
                                    alt={item.Title}
                                    className="mobile-image"
                                />
                            ) : (
                                <div className="mobile-image" />
                            )}

                            <div className="slide-content">
                                <h1 className="slide-headline">{item.Title}</h1>
                                <p className="slide-description">{item.Description}</p>
                                {item.cta && (
                                    <a href="#" className="slide-button">
                                        {item.cta}
                                    </a>
                                )}

                                {/* Arrows Group (Moved here) */}
                                <div className="arrow-group">
                                    <button
                                        className="carousel-arrow arrow-prev"
                                        onClick={prevSlide}
                                        aria-label="Previous Slide"
                                        disabled={isFirstSlide}
                                    >
                                        <CaretLeft size={32} weight="bold" />
                                    </button>
                                    <button
                                        className="carousel-arrow arrow-next"
                                        onClick={nextSlide}
                                        aria-label="Next Slide"
                                        disabled={isLastSlide}
                                    >
                                        <CaretRight size={32} weight="bold" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Pagination Dots */}
            <div className="carousel-dots">
                {items.map((_, index) => (
                    <button
                        key={`dot-${index}`}
                        className={`dot-button ${index === currentIndex ? 'active' : ''}`}
                        onClick={() => goToSlide(index)}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default Slider;
