export interface NavLink {
    id: number;
    Navname: string;
    Navurl: string;
}

export interface NavButton {
    id: number;
    Buttonname: string;
    Buttonurl: string;
    type: 'primary' | 'secondary' | 'textlink';
}

export interface NavDropdownItem {
    id: number;
    Navtitle: string;
    Navitems: NavLink[];
}

export interface NavLogo {
    id: number;
    url: string;
    alternativeText: string | null;
    width: number;
    height: number;
    name: string;
}

export interface NavbarData {
    id: number;
    Navlogo: NavLogo;
    Navitems: NavLink[];
    Navdropdown: NavDropdownItem[];
    Navbutton: NavButton;
    Loginbutton: NavButton;
}

export interface NavbarProps {
    data: NavbarData | null;
}
