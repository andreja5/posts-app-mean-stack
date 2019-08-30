import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Post } from './post.model';

import { environment } from '../../environments/environment';
const BACKEND_URL = environment.apiUrl + '/posts/';
 
@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private http: HttpClient, private router: Router) {}

  private postUpdated = new Subject<{ posts: Post[], postCount: number }>();
  private posts: Post[] = [];

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http.get<{ message: string, posts: any, maxPosts: number }>(BACKEND_URL + queryParams)
      .pipe(map(postData => {
        return {
          posts: postData.posts.map(post => {
          return {
            naslov: post.naslov,
            opis: post.opis,
            id: post._id,
            imagePath: post.imagePath,
            creator: post.creator
          };
        }),
        maxPosts: postData.maxPosts
      };
      }))
      .subscribe(transformedPostData => {
        this.posts = transformedPostData.posts;
        this.postUpdated.next({ posts: [...this.posts], postCount: transformedPostData.maxPosts });
      })
  }

  getPost(postId: string) {
    return this.http.get<{_id: string, naslov: string, opis: string, imagePath: string, creator: string}>(BACKEND_URL + postId)
  }

  getPostUpdateListener() {
    return this.postUpdated.asObservable();
  }

  addPost(naslov: string, opis: string, slika: File) {
    const postData = new FormData();
    postData.append('naslov', naslov);
    postData.append('opis', opis);
    postData.append('slika', slika, naslov);
    this.http.post<{message: string, post: Post}>(BACKEND_URL, postData)
      .subscribe((responseData) => {
        this.router.navigate(['/']);
      });
  }

  updatedPost(id: string, naslov: string, opis: string, slika: File | string) {
    let postData: Post | FormData;
    if (typeof slika === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('naslov', naslov);
      postData.append('opis', opis);
      postData.append('slika', slika, naslov);
    } else {
      postData = {
        id: id,
        naslov: naslov,
        opis: opis,
        imagePath: slika,
        creator: null
      }
    }

    this.http.put(BACKEND_URL + id, postData)
      .subscribe(response => {
        this.router.navigate(['/']);
      })
  }

  deletePost(postId: string) {
    return this.http.delete(BACKEND_URL + postId);
  }

}