import type { Schema, Struct } from '@strapi/strapi';

export interface NavigationNavbar extends Struct.ComponentSchema {
  collectionName: 'components_navigation_navbars';
  info: {
    displayName: 'Navbar';
    icon: 'dashboard';
  };
  attributes: {
    Navbutton: Schema.Attribute.Component<'navigation.navbutton', false>;
    Navdropdown: Schema.Attribute.Component<'navigation.navdropdown', true>;
    Navitems: Schema.Attribute.Component<'navigation.navlink', true>;
    Navlogo: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    Secondarybutton: Schema.Attribute.Component<'navigation.navbutton', false>;
  };
}

export interface NavigationNavbutton extends Struct.ComponentSchema {
  collectionName: 'components_navigation_navbuttons';
  info: {
    displayName: 'Navbutton';
  };
  attributes: {
    Buttonname: Schema.Attribute.String;
    Buttonurl: Schema.Attribute.String;
    type: Schema.Attribute.Enumeration<['primary', 'secondary', 'textlink']>;
  };
}

export interface NavigationNavdropdown extends Struct.ComponentSchema {
  collectionName: 'components_navigation_navdropdowns';
  info: {
    displayName: 'Navdropdown';
  };
  attributes: {
    Navitems: Schema.Attribute.Component<'navigation.navlink', true>;
    Navtitle: Schema.Attribute.String;
  };
}

export interface NavigationNavlink extends Struct.ComponentSchema {
  collectionName: 'components_navigation_navlinks';
  info: {
    displayName: 'Navlink';
    icon: 'link';
  };
  attributes: {
    Navname: Schema.Attribute.String;
    Navurl: Schema.Attribute.String;
  };
}

export interface SlidersSlides extends Struct.ComponentSchema {
  collectionName: 'components_sliders_slides';
  info: {
    displayName: 'Slides';
    icon: 'apps';
  };
  attributes: {
    cta: Schema.Attribute.String;
    Description: Schema.Attribute.Text;
    Desktopimages: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
    Mobileimages: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
    Title: Schema.Attribute.String;
  };
}

export interface TrustedTrustedsection extends Struct.ComponentSchema {
  collectionName: 'components_trusted_trustedsections';
  info: {
    displayName: 'Trustedsection';
  };
  attributes: {
    Title: Schema.Attribute.String;
    Trustlist: Schema.Attribute.Component<'trusted.trustlist', true>;
  };
}

export interface TrustedTrustlist extends Struct.ComponentSchema {
  collectionName: 'components_trusted_trustlists';
  info: {
    displayName: 'Trustlist';
  };
  attributes: {
    Description: Schema.Attribute.String;
    Icon: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    Title: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'navigation.navbar': NavigationNavbar;
      'navigation.navbutton': NavigationNavbutton;
      'navigation.navdropdown': NavigationNavdropdown;
      'navigation.navlink': NavigationNavlink;
      'sliders.slides': SlidersSlides;
      'trusted.trustedsection': TrustedTrustedsection;
      'trusted.trustlist': TrustedTrustlist;
    }
  }
}
