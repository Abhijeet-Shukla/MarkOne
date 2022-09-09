import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';

import { Post } from '../post.model';
import { PostService } from '../post.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

  // posts = [
  //   {title: "First Post", content: "The first posts content"},
  //   {title: "Second Post", content: "The second posts content"},
  //   {title: "Third Post", content: "The third posts content"},
  //   {title: "Fourth Post", content: "The fourth posts content"},
  //   {title: "Fifth Post", content: "The fifth posts content"}
  // ];

  posts :Post[] = [];
  private postsSub: Subscription;
  public isLoading: boolean = false;

  public totPosts = 0;
  public postPerPage = 2;
  public currPage = 1;
  public postSize = [1,2,4,8,10];

  constructor(public postsService: PostService) { }

  ngOnInit(): void {

    this.isLoading = true;
    this.postsService.getPosts(this.postPerPage, this.currPage);
    this.postsSub = this.postsService.getPostUpdateListener()
    .subscribe((postData: {posts: Post[], postCount: number}) => {
      this.isLoading=false;
      this.totPosts = postData.postCount;
      this.posts = postData.posts;
      console.log(this.posts.length);
    });

  }

  ngOnDestroy(): void {
      this.postsSub.unsubscribe();
  }

  onDelete(postId: string){
    this.isLoading = true;
    this.postsService.deletePost(postId).subscribe(() => {
      this.postsService.getPosts(this.postPerPage, this.currPage);
    });
  }

  onChangedPage(pageData: PageEvent){
    this.isLoading = true;
    this.currPage = pageData.pageIndex + 1;
    this.postPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postPerPage, this.currPage);
  }

}
