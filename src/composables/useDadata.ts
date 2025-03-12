import { ref } from 'vue';


export const useDadata = () => {
  const apiKey = ref<string>(localStorage.getItem('dadata_api_key') || '');
  const data = ref<SuggestionsResponse | null>(null);

  const saveApiKey = (): void => {
    localStorage.setItem('dadata_api_key', apiKey.value);
  };

  const fetchData = async (query: string): Promise<SuggestionsResponse | null> => {
    try {
      const response = await fetch('https://suggestions.dadata.ru/suggestions/api/4_1/rs/findById/party', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${apiKey.value}`,
        },
        body: JSON.stringify({ query }),
      });
      const result: SuggestionsResponse = await response.json();
      return result;
    } catch (error) {
      console.error('fetchData err:', error);
      return null;
    }
  };

  return { apiKey, data, saveApiKey, fetchData };
};

interface Suggestion {
  value: string;
  unrestricted_value: string;
  data: {
    kpp: string;
    kpp_largest: string | null;
    capital: string | null;
    invalid: boolean | null;
    management: {
      name: string;
      post: string;
      start_date: number;
      disqualified: boolean | null;
    } | null;
    founders: any;
    managers: any;
    predecessors: any;
    successors: any;
    branch_type: string;
    branch_count: number;
    source: string | null;
    qc: number | null;
    hid: string;
    type: string;
    state: {
      status: string;
      code: string | null;
      actuality_date: number;
      registration_date: number;
      liquidation_date: number | null;
    };
    opf: {
      type: string;
      code: string;
      full: string;
      short: string;
    };
    name: {
      full_with_opf: string;
      short_with_opf: string;
      latin: string | null;
      full: string;
      short: string;
    };
    inn: string;
    ogrn: string;
    okpo: string;
    okato: string;
    oktmo: string;
    okogu: string;
    okfs: string;
    okved: string;
    okveds: any;
    authorities: any;
    documents: any;
    licenses: any;
    finance: any;
    address: {
      value: string;
      unrestricted_value: string;
      invalidity: boolean | null;
      data: {
        postal_code: string;
        country: string;
        country_iso_code: string;
        federal_district: string;
        region_fias_id: string;
        region_kladr_id: string;
        region_iso_code: string;
        region_with_type: string;
        region_type: string;
        region_type_full: string;
        region: string;
        area_fias_id: string;
        area_kladr_id: string;
        area_with_type: string;
        area_type: string;
        area_type_full: string;
        area: string;
        city_fias_id: string;
        city_kladr_id: string;
        city_with_type: string;
        city_type: string;
        city_type_full: string;
        city: string;
        street_fias_id: string;
        street_kladr_id: string;
        street_with_type: string;
        street_type: string;
        street_type_full: string;
        street: string;
        house_fias_id: string;
        house_kladr_id: string;
        house_cadnum: string;
        house_type: string;
        house_type_full: string;
        house: string;
        fias_id: string;
        fias_code: string;
        fias_level: string;
        fias_actuality_state: string;
        kladr_id: string;
        geoname_id: string;
        capital_marker: string;
        okato: string;
        oktmo: string;
        tax_office: string;
        tax_office_legal: string;
        timezone: string;
        geo_lat: string;
        geo_lon: string;
        qc_geo: string;
        source: string;
        qc: string;
      };
    };
    phones: string | null;
    emails: string | null;
    ogrn_date: number;
    okved_type: string;
    employee_count: number | null;
  };
}

interface SuggestionsResponse {
  suggestions: Suggestion[];
}
