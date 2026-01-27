'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import './Navbar.scss';
import { getStrapiURL } from '@/lib/strapi';
import { NavbarProps } from './types';
import gsap from 'gsap';
import { CaretDown } from '@phosphor-icons/react';

const Navbar: React.FC<NavbarProps> = ({ data }) => {
    // GSAP Refs
    const dropdownWrapperRef = useRef<HTMLDivElement>(null);
    const navBodyRef = useRef<HTMLDivElement>(null);
    const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Store refs for mobile contents for animation
    const mobileContentRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

    // Mobile State
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [mobileOpenIndexes, setMobileOpenIndexes] = useState<number[]>([]);

    if (!data) return null;
    const { Navlogo, Navitems, Navdropdown, Navbutton, Loginbutton } = data;

    // Helper to handle image URLs
    const logoUrl = Navlogo?.url ? (Navlogo.url.startsWith('http') ? Navlogo.url : getStrapiURL(Navlogo.url)) : '';

    // --- Desktop Interactions ---

    const openDropdown = (targetId: string, triggerElement: HTMLElement) => {
        if (window.innerWidth <= 992) return;
        if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);

        // Find target menu
        const targetMenu = document.getElementById(`dropdown-${targetId}`);
        if (!targetMenu || !dropdownWrapperRef.current || !navBodyRef.current) return;

        // Manage classes & GSAP states
        const allMenus = document.querySelectorAll('.dropdown-menu');

        // Reset all menus first to ensure no overlap or persistent visibility
        gsap.set(allMenus, { autoAlpha: 0 });
        allMenus.forEach(el => el.classList.remove('active'));

        // Reset triggers
        const allTriggers = document.querySelectorAll('.nav-link');
        allTriggers.forEach(el => el.classList.remove('active'));

        targetMenu.classList.add('active');
        triggerElement.classList.add('active');
        dropdownWrapperRef.current.classList.add('open');

        // Positioning logic (Simple alignment)
        const navBodyRect = navBodyRef.current.getBoundingClientRect();
        const triggerRect = triggerElement.getBoundingClientRect();
        const menuWidth = targetMenu.offsetWidth;

        // Center relative to trigger
        const triggerCenterRel = (triggerRect.left - navBodyRect.left) + (triggerRect.width / 2);
        const desiredLeft = triggerCenterRel - (menuWidth / 2);

        // Apply simple positioning directly to the menu
        gsap.set(targetMenu, {
            left: desiredLeft,
            autoAlpha: 1
        });
    };

    const closeDropdown = () => {
        if (window.innerWidth <= 992) return;

        if (dropdownWrapperRef.current) {
            dropdownWrapperRef.current.classList.remove('open');
        }

        const allMenus = document.querySelectorAll('.dropdown-menu');
        const allTriggers = document.querySelectorAll('.nav-link');

        // Simple fade out
        gsap.to(allMenus, {
            autoAlpha: 0,
            duration: 0.2
        });

        // Remove active classes
        allTriggers.forEach(el => el.classList.remove('active'));

        setTimeout(() => {
            allMenus.forEach(el => el.classList.remove('active'));
        }, 200);
    };

    const handleMouseEnter = (id: string, e: React.MouseEvent) => {
        if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
        openDropdown(id, e.currentTarget as HTMLElement);
    };

    const handleMouseLeave = () => {
        closeTimeoutRef.current = setTimeout(closeDropdown, 300);
    };

    // --- Mobile Interactions ---
    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
        if (!isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    };

    const toggleMobileAccordion = (index: number) => {
        const isOpen = mobileOpenIndexes.includes(index);
        const contentRef = mobileContentRefs.current[index];

        if (isOpen) {
            // Collapse
            if (contentRef) {
                gsap.to(contentRef, {
                    height: 0,
                    duration: 0.3,
                    ease: "power2.inOut",
                    onComplete: () => {
                        setMobileOpenIndexes(prev => prev.filter(i => i !== index));
                    }
                });
            } else {
                setMobileOpenIndexes(prev => prev.filter(i => i !== index));
            }
        } else {
            // Expand
            setMobileOpenIndexes(prev => [...prev, index]);
        }
    };

    // Effect to animate opening of accordion when index changes (specifically for OPENING)
    useEffect(() => {
        mobileOpenIndexes.forEach(index => {
            const contentRef = mobileContentRefs.current[index];
            if (contentRef) {
                gsap.to(contentRef, {
                    height: "auto",
                    duration: 0.3,
                    ease: "power2.inOut"
                });
            }
        });
    }, [mobileOpenIndexes]);

    // Clean up on unmount or resize
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 992 && isMobileMenuOpen) {
                setIsMobileMenuOpen(false);
                document.body.style.overflow = 'auto';
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isMobileMenuOpen]);


    return (
        <header className="navbar-container">
            <div className="nav-body" ref={navBodyRef}>

                {/* Logo */}
                <div className="navbar-logo">
                    <Link href="/">
                        {logoUrl ? (
                            <Image
                                src={logoUrl}
                                alt={Navlogo?.alternativeText || 'Logo'}
                                width={Navlogo?.width || 120}
                                height={Navlogo?.height || 40}
                                className="logo-image"
                                unoptimized={true}
                            />
                        ) : (
                            <span className="logo-text">Logo</span>
                        )}
                    </Link>
                </div>

                {/* DESKTOP MENU WRAPPER */}
                <div className="nav-menu-wrapper">
                    <nav className="nav-links">
                        {/* Dropdown Triggers (Navdropdown) - Rendered FIRST */}
                        {Navdropdown && Navdropdown.map((drop) => (
                            <div
                                key={drop.id}
                                id={`trigger-${drop.id}`}
                                className="nav-link" // Using nav-link class directly for trigger styling
                                onMouseEnter={(e) => handleMouseEnter(drop.id.toString(), e)}
                                onMouseLeave={handleMouseLeave}
                            >
                                {drop.Navtitle} <CaretDown weight="bold" />
                            </div>
                        ))}

                        {/* Static Links (Navitems) - Rendered SECOND */}
                        {Navitems && Navitems.map((item) => (
                            <div key={item.id} className="nav-item">
                                <Link href={item.Navurl || '#'} className="nav-link">
                                    {item.Navname}
                                </Link>
                            </div>
                        ))}
                    </nav>

                    <div className="nav-buttons">
                        {Loginbutton && (
                            <Link
                                href={Loginbutton.Buttonurl || '#'}
                                className={`btn btn-${Loginbutton.type || 'secondary'}`} // Default to secondary/text
                            >
                                {Loginbutton.Buttonname}
                            </Link>
                        )}
                        {Navbutton && (
                            <Link
                                href={Navbutton.Buttonurl || '#'}
                                className={`btn btn-${Navbutton.type || 'primary'}`}
                            >
                                {Navbutton.Buttonname}
                            </Link>
                        )}
                    </div>
                </div>

                {/* DESKTOP DROPDOWN CONTENT WRAPPER */}
                <div
                    className="dropdown-wrapper"
                    ref={dropdownWrapperRef}
                    onMouseEnter={() => { if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current); }}
                    onMouseLeave={handleMouseLeave}
                >
                    {/* Removed dropdown-background */}
                    <div className="dropdown-content-area">
                        {Navdropdown && Navdropdown.map((drop) => (
                            <div
                                key={drop.id}
                                className="dropdown-menu"
                                id={`dropdown-${drop.id}`}
                            >
                                {drop.Navitems && drop.Navitems.map((subItem) => (
                                    <Link
                                        key={subItem.id}
                                        href={subItem.Navurl || '#'}
                                        className="dropdown-item"
                                    >
                                        {subItem.Navname}
                                    </Link>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>

                {/* MOBILE TOGGLE - Custom Animated Icon */}
                <div
                    className={`nav-icon-3 ${isMobileMenuOpen ? 'open' : ''}`}
                    onClick={toggleMobileMenu}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>

                {/* MOBILE FULL SCREEN MENU */}
                <div className={`mobile-nav-menu ${isMobileMenuOpen ? 'active' : ''}`}>
                    <nav className="nav-links mobile">
                        {/* Dropdowns as Accordions - Rendered FIRST */}
                        {Navdropdown && Navdropdown.map((drop) => {
                            const isOpen = mobileOpenIndexes.includes(drop.id);
                            return (
                                <div key={drop.id} className={`nav-item mobile-trigger ${isOpen ? 'open' : ''}`}>
                                    <div
                                        className="nav-link"
                                        onClick={() => toggleMobileAccordion(drop.id)}
                                    >
                                        {drop.Navtitle} <CaretDown weight="bold" className="caret-icon" />
                                    </div>
                                    {/* Render with dynamic height */}
                                    <div
                                        className="mobile-menu-content"
                                        ref={(el) => { mobileContentRefs.current[drop.id] = el; }}
                                        style={{ height: 0, overflow: 'hidden', display: mobileOpenIndexes.includes(drop.id) ? 'block' : 'block' }} // Keep display block but height 0 for GSAP
                                    >
                                        {drop.Navitems && drop.Navitems.map((subItem) => (
                                            <Link
                                                key={subItem.id}
                                                href={subItem.Navurl || '#'}
                                                className="dropdown-item"
                                                onClick={toggleMobileMenu}
                                            >
                                                {subItem.Navname}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}

                        {/* Static Links - Rendered SECOND */}
                        {Navitems && Navitems.map((item) => (
                            <div key={item.id} className="nav-item">
                                <Link href={item.Navurl || '#'} className="nav-link" onClick={toggleMobileMenu}>
                                    {item.Navname}
                                </Link>
                            </div>
                        ))}
                    </nav>

                    <div className="nav-buttons">
                        {Loginbutton && (
                            <Link
                                href={Loginbutton.Buttonurl || '#'}
                                className={`btn btn-${Loginbutton.type || 'textlink'}`} // Mobile often uses text or secondary
                                onClick={toggleMobileMenu}
                            >
                                {Loginbutton.Buttonname}
                            </Link>
                        )}
                        {Navbutton && (
                            <Link
                                href={Navbutton.Buttonurl || '#'}
                                className={`btn btn-${Navbutton.type || 'primary'}`}
                                onClick={toggleMobileMenu}
                            >
                                {Navbutton.Buttonname}
                            </Link>
                        )}
                    </div>
                </div>

            </div>
        </header>
    );
};

export default Navbar;
