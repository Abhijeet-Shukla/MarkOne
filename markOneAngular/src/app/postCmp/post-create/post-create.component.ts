import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { Post } from '../post.model';
import { PostService } from '../post.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {

  enteredTitle='';
  enteredContent='';
  private createMode: boolean = true;
  private postId: string = "";
  public post: Post;
  public isLoading: boolean = false;

  constructor(public postsService: PostService, public route: ActivatedRoute) { }

  ngOnInit(): void {

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if(paramMap.has('postId')){
        this.createMode = false;
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postsService.getPost(this.postId).subscribe(postData => {
          this.isLoading = false;
          this.post = {
            id: postData._id,
            title: postData.title,
            content: postData.content
          }
        });
      }
      else{
        this.createMode = true;
        this.postId = "";
      }
    });

  }

  onPostSave(form: NgForm){

    if(form.invalid){
      return;
    }

    this.isLoading = true;
    if( this.createMode){
      this.postsService.addPosts(form.value.title, form.value.content);
      form.resetForm();
    }

    else{
      console.log("Title: " +form.value.title+ " Content: " +form.value.content);
      this.postsService.updatePosts(this.postId, form.value.title, form.value.content);
    }

  }

}
