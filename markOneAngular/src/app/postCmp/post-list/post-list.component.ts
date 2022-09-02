import { Component, OnInit, Input, OnDestroy } from '@angular/core';
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

  constructor(public postsService: PostService) { }

  ngOnInit(): void {

    this.isLoading = true;
    this.postsService.getPosts();
    this.postsSub = this.postsService.getPostUpdateListener()
    .subscribe((posts: Post[]) => {
      this.posts = posts;
      this.isLoading=false;
      console.log(this.posts.length);
    });

  }

  ngOnDestroy(): void {
      this.postsSub.unsubscribe();
  }

  onDelete(postId: string){
    this.postsService.deletePost(postId);
  }

}
