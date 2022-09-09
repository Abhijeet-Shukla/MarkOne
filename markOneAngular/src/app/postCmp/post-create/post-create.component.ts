import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { Post } from '../post.model';
import { PostService } from '../post.service';
import { mimeType } from './mime-type.validator'

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
  form: FormGroup;
  imagePreview: string;

  constructor(public postsService: PostService, public route: ActivatedRoute) { }

  ngOnInit(): void {

    this.form = new FormGroup({
      'title': new FormControl(null,
        {validators: [ Validators.required, Validators.minLength(3) ]}),
      'content': new FormControl(null,
        {validators: [ Validators.required ]}),
      'image': new FormControl(null,
        {validators: [ Validators.required ], asyncValidators: [mimeType]})
      });
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
            content: postData.content,
            imagePath: postData.imagePath
          };
          this.form.setValue({
            'title': this.post.title,
            'content': this.post.content,
            'image': this.post.imagePath
          });
        });
      }
      else{
        this.createMode = true;
        this.postId = "";
      }
    });

  }

  onPostSave(){

    if(this.form.invalid){
      return;
    }

    this.isLoading = true;
    if( this.createMode){
      this.postsService.addPosts(
        this.form.value.title,
        this.form.value.content,
        this.form.value.image);
      this.form.reset();
    }

    else{
      console.log("Title: " +this.form.value.title+ " Content: " +this.form.value.content);
      this.postsService.updatePosts(
        this.postId,
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
        );
    }

  }

  onImagePick(event: Event){
    const file = (event.target as HTMLInputElement).files[0];
    const read = new FileReader();
    this.form.patchValue({
      'image': file
    });
    this.form.get('image').updateValueAndValidity();
    read.onload = () => {
      this.imagePreview = read.result.toString();
    };
    read.readAsDataURL(file)
    console.log(file);
    console.log(this.form);
  }

}
