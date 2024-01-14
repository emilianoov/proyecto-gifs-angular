import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchResponse } from '../interfaces/gis.interfaces';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  public gifList: Gif[] = [];

  private _tagsHitory: string [] = [];

  private apiKey: string = 'kFEB1ggFIH7XGOh0VLzO3efSAobBRVPx';
  private serviceUrl: string = 'https://api.giphy.com/v1/gifs'

  constructor( private http: HttpClient ) {
    this.loadLocalStorage();
   }

  get tagsHistory(){
    return [...this._tagsHitory];
  }

  private organizeTag( tag: string ){
    tag = tag.toLowerCase();

    if ( this._tagsHitory.includes(tag) ){
      this._tagsHitory = this._tagsHitory.filter( (oldTag) => oldTag !== tag );
    }

    this._tagsHitory.unshift(tag);
    this._tagsHitory =this._tagsHitory.splice(0, 10);
    this.saveLocalStorage();
  }

  private saveLocalStorage():void{
    localStorage.setItem('history', JSON.stringify( this._tagsHitory ) )
  }

  private loadLocalStorage():void{
    if ( !localStorage.getItem('history')) return;
    
    this._tagsHitory = JSON.parse( localStorage.getItem('history')!);

    if (this._tagsHitory.length === 0)return;
    this.searchTag( this._tagsHitory[0]);
  }

  searchTag( tag: string ):void {
    if (tag.length === 0) return;
    this.organizeTag(tag);
    
    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('limit', '20')
      .set('q', tag)

    this.http.get<SearchResponse>(`${this.serviceUrl}/search`, { params })
      .subscribe( resp =>{

        this.gifList = resp.data;
        
        
      })
    
  }


}
