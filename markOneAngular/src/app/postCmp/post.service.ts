import { Injectable } from "@angular/core";
import { Subject } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs";

import { Post } from "./post.model";
import { Router } from "@angular/router";

@Injectable({providedIn: 'root'})
export class PostService{

  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(){
    this.http.get<{message: String, posts: any}>("http://localhost:3000/api/posts")
    .pipe(map((postData) => {
      return postData.posts.map(post => {
        return {
          title: post.title,
          content: post.content,
          id: post._id
        };
      });
    }))
    .subscribe((tPosts) => {
      this.posts = tPosts;
      this.postsUpdated.next([...this.posts]);
    });
  }

  deletePost(postId: String){
    this.http.delete("http://localhost:3000/api/posts/" + postId)
    .subscribe(() => {
      this.posts = this.posts.filter(post => post.id != postId);
      this.postsUpdated.next([...this.posts]);
      console.log("Post with id: " + postId + " deleted!!");
    });
  }

  getPostUpdateListener(){
    return this.postsUpdated.asObservable();
  }

  getPost(postId: string){
    return this.http.get<{_id: string, title: string, content: string}>('http://localhost:3000/api/posts/' + postId);
  }

  addPosts(title:string, content:string){
    const post: Post = {id: null, title: title, content: content};
    this.http.post<{ message: string, postId: string }>('http://localhost:3000/api/posts', post)
    .subscribe((responseData) => {
      console.log(responseData.message);
      post.id = responseData.postId;
      this.posts.push(post);
      this.postsUpdated.next([...this.posts]);
      this.router.navigate(["/"]);
    });
  }

  updatePosts(postId: string, title: string, content: string){
    const post: Post = {id: postId, title: title, content: content};
    this.http.patch('http://localhost:3000/api/posts/' + postId, post)
    .subscribe(responseData => {
      console.log(responseData);
      const updPosts = [...this.posts];
      const oldPostIndex = updPosts.findIndex(p => p.id === post.id);
      updPosts[oldPostIndex] = post;
      this.posts = updPosts;
      this.postsUpdated.next([...this.posts]);
      this.router.navigate(["/"]);
    });
  }

}
