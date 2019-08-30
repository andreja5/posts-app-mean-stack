import { Post } from './../post.model';
import { Component, OnInit, OnDestroy  } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PostService } from '../post.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { mimeType } from './mime-type.validator';
import { Subscription } from 'rxjs/internal/Subscription';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-kreiraj-post',
  templateUrl: './kreiraj-post.component.html',
  styleUrls: ['./kreiraj-post.component.css']
})
export class KreirajPostComponent implements OnInit, OnDestroy {

  private mode = 'create';
  private postId: string;
  private authStatusSub: Subscription;
  post: Post;
  form: FormGroup;
  isLoading = false;
  imagePreview: string | ArrayBuffer;

  constructor(private postService: PostService, private route: ActivatedRoute, private authService: AuthService) { }

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    )
    this.form = new FormGroup({
      naslov: new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
      opis: new FormControl(null, {validators: [Validators.required]}),
      slika: new FormControl(null, {validators: [Validators.required], asyncValidators: [mimeType]})
    })
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postService.getPost(this.postId)
          .subscribe(postData => {
            this.isLoading = false
            this.post = {
              id: postData._id,
              naslov: postData.naslov,
              opis: postData.opis,
              imagePath: postData.imagePath,
              creator: postData.creator
            }
            this.form.setValue({
              naslov: this.post.naslov,
              opis: this.post.opis,
              slika: this.post.imagePath
            })
          });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    })
  }

  sacuvajPost() {
    if (this.form.invalid) {
      return;
    }
    // ukoliko je mode create dodace novi post, a ukoliko je mode edit onda ce update-ovati postojeci post
    this.isLoading = true;
    if (this.mode === 'create') {
      this.postService.addPost(this.form.value.naslov, this.form.value.opis, this.form.value.slika);
    } else {
      this.postService.updatedPost(this.postId, this.form.value.naslov, this.form.value.opis, this.form.value.slika)
    }
    this.form.reset();
  }

  onImagePick(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({slika: file});
    this.form.get('slika').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    }
    reader.readAsDataURL(file);
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
