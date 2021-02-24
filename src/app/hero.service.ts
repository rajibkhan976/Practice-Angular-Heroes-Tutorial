import { Injectable } from '@angular/core';
import { Hero } from './hero';
import { HEROES } from './mock-heroes';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable()
export class HeroService {

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) { }

  private heroesUrl = 'api/heroes';

  getHeroes(): Observable<Hero[]> {

    this.messageService.addMessgae('HeroService: fetched heroes');

    return this.http.get<Hero[]>(this.heroesUrl)
                                .pipe(
                                  tap(heroes => this.log(`fetched heroes`)),
                                  catchError(this.handleError('getHeroes', []))
                                );
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);

      this.log(`${operation} failed: ${error.message}`);

      return of(result as T);
    }
  }

  private log(message: string) {
    this.messageService.addMessgae('HeroService: ' + message);
  }

  getHero(id: number): Observable<any> {
    const url = `${this.heroesUrl}/${id}`;
    this.messageService.addMessgae(`HeroService: fetched hero id=${id}`);
    
    return this.http.get<Hero>(url).pipe(
      tap(_ => this.log(`fetched hero id = ${id}`)),
      catchError(this.handleError<Hero>(`getHero id = ${id}`))
    );
  }

  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      return of([]);
    }

    return this.http.get<Hero[]>(`api/heroes/?name=${term}`).pipe(
      tap(_ => this.log(`Found heroes matching ${term}`)),
      catchError(this.handleError<Hero[]>(`searchHeroes`, []))
    )
  }

  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, httpOptions)
                    .pipe(
                      tap((hero: Hero) => this.log(`Added hero id = ${hero.id}`)),
                      catchError(this.handleError<Hero>(`addHero`))
                    )
  }

  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, httpOptions)
                    .pipe(
                      tap(_ => this.log(`Updated hero id = ${hero.id}`)),
                      catchError(this.handleError<any>(`updateHero`))
                    );
  }

  deleteHero(hero: Hero | number): Observable<Hero> {
    const id = typeof hero === 'number' ? hero : hero.id;
    const url = `${this.heroesUrl}/${id}`;

    return this.http.delete<Hero>(url, httpOptions).pipe(
      tap(_ => this.log(`Deleted hero id = ${id}`)),
      catchError(this.handleError<Hero>(`deleteHero`))
    )
  }
}
