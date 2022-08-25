import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

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

  constructor(public postsService: PostService) { }

  ngOnInit(): void {
  }

  onPostAdd(form: NgForm){

    if(form.invalid){
      return;
    }

    const post: Post={
      title: form.value.title,
      content: form.value.content };

    this.postsService.addPosts(form.value.title, form.value.content);
    form.resetForm();
  }

}
