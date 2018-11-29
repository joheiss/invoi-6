import {ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {DocumentLink} from '../../models/document-link';
import {MatDialog, MatDialogRef, MatSelectChange} from '@angular/material';
import {Store} from '@ngrx/store';
import {InvoicingState} from '../../store/reducers';
import * as fromStore from '../../store';
import * as fromStorage from '../../../storage/store';
import {Observable} from 'rxjs/index';
import {FileUploadDialogComponent} from '../../popups';
import {Transaction} from '../../models/transaction';
import {MasterData} from '../../models/master-data';
import {DocumentLinksBusinessService} from '../../business-services';
import {take, tap} from 'rxjs/operators';

@Component({
  selector: 'jo-document-link-list',
  templateUrl: './document-link-list.component.html',
  styleUrls: ['./document-link-list.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocumentLinkListComponent implements OnChanges {
  @Input() object: Transaction | MasterData;

  documentLinks$: Observable<DocumentLink[]>;
  fileUploadDialogRef: MatDialogRef<FileUploadDialogComponent>;
  selectionList: any[] = [];
  selectAll = false;

  constructor(private store: Store<InvoicingState>,
              private dialog: MatDialog,
              private service: DocumentLinksBusinessService) {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.documentLinks$ = this.service.getDocumentLinks(this.object.ownerKey);
  }

  getFilePath(): string {
    return `/docs/${this.object.ownerKey}`;
  }

  isAnythingSelected(): boolean {
    return this.selectionList.length > 0;
  }

  isSelected(documentLink): boolean {
    return this.selectionList.findIndex(link => link.path === documentLink.path) >= 0;
  }

  onAttachToEmailChanged(documentLink: DocumentLink) {
    this.service.update({...documentLink, attachToEmail: !documentLink.attachToEmail});
  }

  onDeleteSelected(event: Event) {
    this.selectionList.forEach(documentLink => {
      this.store.dispatch(new fromStore.DeleteDocumentLink(documentLink));
      this.store.dispatch(new fromStorage.DeleteFile(documentLink.path));
    });
    this.selectionList = [];
    this.selectAll = false;
    event.stopPropagation();
  }

  onDownloadSelected(event: Event) {
    this.selectionList.forEach(documentLink => this.store.dispatch(new fromStorage.DownloadFile(documentLink.path)));
    this.selectionList = [];
    this.selectAll = false;
    event.stopPropagation();
  }

  onToggleSelect(documentLink) {
    const index = this.selectionList.findIndex(link => link.path === documentLink.path);
    if (index >= 0) {
      this.selectAll = false;
      this.selectionList = this.selectionList.filter(selected => selected.path !== documentLink.path);
    } else {
      this.selectionList.push(documentLink);
    }
  }

  onToggleSelectAll(event) {
    this.selectAll = event.checked;
    if (this.selectAll) {
      this.selectionList = [];
      this.documentLinks$.pipe(
        take(1)
      ).subscribe(links => links.forEach(link => this.selectionList.push(link)));
    } else {
      this.selectionList = [];
    }
  }

  onTypeChanged(event: MatSelectChange, documentLink: DocumentLink) {
    this.service.update({...documentLink, type: +event.value});
  }

  onUpload(event: Event) {
    const newDocumentLink: DocumentLink = {
      name: undefined,
      type: 6,
      path: this.getFilePath(),
      attachToEmail: false,
      owner: this.object.ownerKey
    };
    this.openFileUploadDialog(newDocumentLink)
      .afterClosed().pipe(
      take(1),
      tap(() => event.stopPropagation())
    ).subscribe(file => {
      if (file) {
        const payload = {
          file: file,
          path: `${this.getFilePath()}/${file.name}`,
          metadata: {
            name: newDocumentLink.name,
            type: newDocumentLink.type,
            attachToEmail: newDocumentLink.attachToEmail,
            owner: this.object.ownerKey
          }
        };
        this.store.dispatch(new fromStorage.UploadFile(payload));
        newDocumentLink.path = payload.path;
        this.store.dispatch(new fromStore.CreateDocumentLink(newDocumentLink));
      }
    });
  }

  protected openFileUploadDialog(newDocumentLink: DocumentLink): MatDialogRef<FileUploadDialogComponent> {
    this.fileUploadDialogRef = this.dialog.open(FileUploadDialogComponent, {
      data: {documentLink: newDocumentLink}
    });
    return this.fileUploadDialogRef;
  }

}


