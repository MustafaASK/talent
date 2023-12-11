import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
//import * as _ from '../assets/smartystreets-sdk-1.1.3.min.js';
import { core, usAutocomplete } from "smartystreets-javascript-sdk"

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  websiteKeyInService = environment.smartyKey;

  constructor() { }
  SmartyStreetsCall(inputs:string): any {
    const SmartyStreetsCore = core;
    // const websiteKey =  this.websiteKeyInService // Your Website Key
    const Lookup = usAutocomplete.Lookup;
    const credentials = new SmartyStreetsCore.SharedCredentials(this.websiteKeyInService);
    const clientBuilder = new SmartyStreetsCore.ClientBuilder(credentials);
    const client = clientBuilder.buildUsAutocompleteClient();
    const lookup = new Lookup(inputs);
    return client.send(lookup);


//     var websiteKey = new SmartyStreetsCore.SharedCredentials(this.websiteKey.apiKey);
    // var clientBuilder = new SmartyStreetsCore.ClientBuilder(websiteKey);
    // var client = clientBuilder.buildUsStreetApiClient();

    
  }

}
