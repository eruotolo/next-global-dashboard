export interface CountryInterface{
    id: string;
    code: string;
    name: string;
}

export interface SimpleCountryInterface{
    id: string;
    code: string;
    name: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface CityInterface{
    id: string;
    codeCountry: string;
    name: string;
    country: CountryInterface
}

export interface SimpleCityInterface{
    id: string;
    codeCountry: string;
    name: string;
    country: CountryInterface
    createdAt?: Date;
    updateAt?: Date;
}