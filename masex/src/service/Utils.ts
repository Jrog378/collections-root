import type { DataModel } from "@toolpad/core";

export interface ArtworkForm {
    title: string;
    medium: string;
    art_height: string;
    art_width: string;
    year: string;
}

export interface Base {
    id: number;
}

export interface ArtworkExport {
    catalog: string;
    artist: string;
    title: string;
    medium: string;
    art_height: string;
    art_width: string;
    year: string;
    url: string;
}

export interface LabelExport {
    catalog: string;
    artist: string;
    title: string;
    medium: string;
    dimensions: string;
    bio: string;
    url: string;
}

export interface Artwork {
    base?: Base
    catalog: string;
    title: string;
    medium: string;
    art_height: string;
    art_width: string;
    art_depth: string;
    year: string;
    cataloged: string;
    quantity: string;
    url: string;
    artist_id?: number;
    donor_id?: number;
    repository_id?: number;
    artist?: Artist
    donor?: Donor
    repository?: Repository
}

export interface Repository {
    base?: Base;
    building_name: string;
    room_number: string;
    campus: string;
    details: string;
}

export interface Artist {
    base?: Base
    first_name: string;
    last_name: string;
    birth_year?: string;
    death_year?: string;
    bio: string;
}


export interface Donor extends DataModel {
    base?: Base
    first_name: string;
    last_name: string;
    birth_year?: string;
    death_year?: string;
    bio: string;
}