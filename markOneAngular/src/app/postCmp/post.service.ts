import { Injectable } from "@angular/core";
import { Subject } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs";

import { Post } from "./post.model";
import { Router } from "@angular/router";
import { identifierName } from "@angular/compiler";

@Injectable({providedIn: 'root'})
export class PostService{

  private posts: Post[] = [];
  private postsUpdated = new Subject<{posts: Post[], postCount: number}>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(postsPerPage: number, currentPage: number){
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http.get<{message: String, posts: any, maxPosts: number}>("http://localhost:3000/api/posts" + queryParams)
    .pipe(map((postData) => {
      return { posts: postData.posts.map(post => {
        return{
          title: post.title,
          content: post.content,
          id: post._id,
          imagePath: post.imagePath
        };
      }),
       maxPosts: postData.maxPosts
    }
    }))
    .subscribe((tPosts) => {
      this.posts = tPosts.posts;
      this.postsUpdated.next({
        posts: [...this.posts],
        postCount: tPosts.maxPosts
      });
    });
  }

  deletePost(postId: String){
    return this.http.delete("http://localhost:3000/api/posts/" + postId);
    // .subscribe(() => {
    //   this.posts = this.posts.filter(post => post.id != postId);
    //   this.postsUpdated.next({
    //     posts: [...this.posts],
    //     maxPosts:
    //   });
    //   console.log("Post with id: " + postId + " deleted!!");
    // });
  }

  getPostUpdateListener(){
    return this.postsUpdated.asObservable();
  }

  getPost(postId: string){
    return this.http.get<{_id: string, title: string, content: string, imagePath: string}>('http://localhost:3000/api/posts/' + postId);
  }

  addPosts(title:string, content:string, image: File){

    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title)

    // const post: Post = {id: null, title: title, content: content};
    this.http.post<{ message: string, post: Post }>('http://localhost:3000/api/posts', postData)
    .subscribe((responseData) => {
      // const post: Post = {
      //   id: responseData.post.id,
      //   title: title,
      //   content: content,
      //   imagePath: responseData.post.imagePath
      // };
      // // console.log(responseData.message);
      // // post.id = responseData.postId;
      // this.posts.push(post);
      // this.postsUpdated.next([...this.posts]);
      this.router.navigate(["/"]);
    });
  }

  updatePosts(postId: string, title: string, content: string, image: File | string){
    const post: Post = {id: postId, title: title, content: content, imagePath: null};
    let postData : Post | FormData;
    if(typeof(image) === 'object'){
      postData = new FormData();
      postData.append("id", postId);
      postData.append("title", title);
      postData.append("content", content);
      postData.append("image", image,title);
    }
    else{
      postData = {
        id: postId,
        title: title,
        content: content,
        imagePath: image
      };
    }

    this.http.patch('http://localhost:3000/api/posts/' + postId, post)
    .subscribe(responseData => {
      // console.log(responseData);
      // const updPosts = [...this.posts];
      // const oldPostIndex = updPosts.findIndex(p => p.id === postId);
      // const post: Post = {
      //   id: postId,
      //   title: title,
      //   content: content,
      //   imagePath: ""
      // };
      // updPosts[oldPostIndex] = post;
      // this.posts = updPosts;
      // this.postsUpdated.next([...this.posts]);
      this.router.navigate(["/"]);
    });
  }

}
