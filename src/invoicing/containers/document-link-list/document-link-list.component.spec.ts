import {DocumentLinkListComponent} from '..';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {DocumentLinksBusinessService} from '../../business-services';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {RouterTestingModule} from '@angular/router/testing';
import {SharedModule} from '../../../shared/shared.module';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {of} from 'rxjs/internal/observable/of';
import {mockAllCountries} from '../../../test/factories/mock-settings.factory';
import {InvoicingState} from '../../store/reducers';
import {Store} from '@ngrx/store';
import {mockAllDocumentLinks, mockSingleDocumentLink} from '../../../test/factories/mock-document-links.factory';
import {cold} from 'jasmine-marbles';
import {Invoice} from '../../models/invoice.model';
import {mockSingleInvoice} from '../../../test/factories/mock-invoices.factory';
import {CreateDocumentLink, DeleteDocumentLink} from '../../store/actions';
import {DeleteFile, DownloadFile, UploadFile} from '../../../storage/store/actions';
import {DocumentLink} from '../../models/document-link';
import {MatDialog, MatSelectChange} from '@angular/material';
import {By} from '@angular/platform-browser';

describe('Document Link List', () => {

  let component: DocumentLinkListComponent;
  let fixture: ComponentFixture<DocumentLinkListComponent>;
  let service: DocumentLinksBusinessService;
  let store: Store<InvoicingState>;
  let dialog: MatDialog;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, RouterTestingModule, SharedModule],
      declarations: [DocumentLinkListComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: DocumentLinksBusinessService,
          useValue: {
            getDocumentLinks: jest.fn(() => cold('-a|', { a: mockAllDocumentLinks()})),
            getCountrySettings: jest.fn(() => of(mockAllCountries())),
            update: jest.fn()
          }
        },
        {
          provide: Store,
          useValue: {
            dispatch: jest.fn(),
            pipe: jest.fn()
          }
        },
        {
          provide: MatDialog,
          useValue: {
            open: jest.fn(() => {
              return {
                afterClosed: jest.fn(() => of({ name: 'anything' }))
              };
            })
          }
        },
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    service = TestBed.get(DocumentLinksBusinessService);
    store = TestBed.get(Store);
    dialog = TestBed.get(MatDialog);
    fixture = TestBed.createComponent(DocumentLinkListComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', async () => {
    return expect(component).toBeTruthy();
  });

  describe('Controller', () => {
    beforeEach(() => {
      component.object = Invoice.createFromData(mockSingleInvoice());
      component.selectionList = [];
      fixture.detectChanges();
    });

    it('should invoke service getDocumentLinks when main object changes', () => {
      const spy = jest.spyOn(service, 'getDocumentLinks');
      component.ngOnChanges({});
      expect(spy).toHaveBeenCalledWith(component.object.ownerKey);
    });

    it('should return the correct path to the file', () => {
      expect(component.getFilePath()).toContain( `/docs/${component.object.ownerKey}`);
    });

    it('should return true if anything is selected, otherwise false', () => {
      expect(component.isAnythingSelected()).toBeFalsy();
      component.selectionList.push('anything');
      expect(component.isAnythingSelected()).toBeTruthy();
    });

    it('should return true if document link is selected, false if not', () => {
      const documentLink = mockSingleDocumentLink();
      expect(component.isSelected(documentLink)).toBeFalsy();
      component.selectionList.push(documentLink);
      expect(component.isSelected(documentLink)).toBeTruthy();
    });

    it('should toggle the attachedToEmail flag', () => {
      const spy = jest.spyOn(service, 'update');
      const documentLink = mockSingleDocumentLink();
      const expected = {...documentLink, attachToEmail: !documentLink.attachToEmail };
      component.onAttachToEmailChanged(documentLink);
      expect(spy).toHaveBeenCalledWith(expected);
    });

    it('should dispatch the actions to delete the selected document link if delete button is pressed', () => {
      const documentLink = mockSingleDocumentLink();
      component.selectionList.push(documentLink);
      const actionDeleteDocumentLink = new DeleteDocumentLink(documentLink);
      const actionDeleteFile = new DeleteFile(documentLink.path);
      const spy = jest.spyOn(store, 'dispatch');
      component.onDeleteSelected(new Event('click'));
      expect(spy).toHaveBeenCalledWith(actionDeleteDocumentLink);
      expect(spy).toHaveBeenCalledWith(actionDeleteFile);
    });

    it('should invoke the actions to download the selected document if download button is pressed', () => {
      const documentLink = mockSingleDocumentLink();
      component.selectionList.push(documentLink);
      const action = new DownloadFile(documentLink.path);
      const spy = jest.spyOn(store, 'dispatch');
      component.onDownloadSelected(new Event('click'));
      expect(spy).toHaveBeenCalledWith(action);
    });

    it('should add respectively delete entry from selected document links if selection flag is toggled', () => {
      const documentLink = mockSingleDocumentLink();
      component.onToggleSelect(documentLink);
      expect(component.selectionList).toHaveLength(1);
      component.onToggleSelect(documentLink);
      expect(component.selectionList).toHaveLength(0);
    });

    it('should add / delete selection for all entries if select all is toggled', () => {
      component.documentLinks$ = of(mockAllDocumentLinks());
      component.onToggleSelectAll({ checked: true });
      expect(component.selectionList.length).toBeGreaterThan(0);
      component.onToggleSelectAll({ checked: false });
      expect(component.selectionList).toHaveLength(0);
    });

    it('should invoke service update if document type is changed', () => {
      const documentLink = mockSingleDocumentLink();
      const spy = jest.spyOn(service, 'update');
      component.onTypeChanged({ value: '4' } as MatSelectChange, documentLink);
      expect(spy).toHaveBeenCalledWith({ ...documentLink, type: 4 });
    });

    it('should dispatch the actions to upload a file and create a document link if upload button is pressed', () => {
      const newDocumentLink: DocumentLink = {
        name: undefined,
        type: 6,
        path: component.getFilePath(),
        attachToEmail: false,
        owner: component.object.ownerKey
      };
      const file = { name: 'anything' };
      const payload = {
        file: file,
        path: `${component.getFilePath()}/${file.name}`,
        metadata: {
          name: undefined,
          type: 6,
          attachToEmail: false,
          owner: component.object.ownerKey
        }
      };
      const actionUploadFile = new UploadFile(payload);
      const actionCreateDocumentLink = new CreateDocumentLink({...newDocumentLink, path: `${component.getFilePath()}/${file.name}`});
      const spy = jest.spyOn(store, 'dispatch');
      component.onUpload(new Event('click'));
      expect(spy).toHaveBeenCalledWith(actionUploadFile);
      expect(spy).toHaveBeenCalledWith(actionCreateDocumentLink);
    });

    it('should open the upload dialog when requested', () => {
      const newDocumentLink: DocumentLink = {
        name: undefined,
        type: 6,
        path: component.getFilePath(),
        attachToEmail: false,
        owner: component.object.ownerKey
      };
      const spy = jest.spyOn(dialog, 'open');
      component['openFileUploadDialog'](newDocumentLink);
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('View', () => {
    beforeEach(() => {
      component.object = Invoice.createFromData(mockSingleInvoice());
      component.selectionList = [];
      fixture.detectChanges();
    });

    it('should only show the upload button if no entry is selected', () => {
      let btn = fixture.debugElement.query(By.css('#btn_upload'));
      expect(btn).toBeTruthy();
      btn = fixture.debugElement.query(By.css('#btn_download'));
      expect(btn).toBeFalsy();
      btn = fixture.debugElement.query(By.css('#btn_delete'));
      expect(btn).toBeFalsy();
    });

    it('should show the download and delete buttons if an entry is selected', () => {
      component.selectionList = [mockSingleDocumentLink()];
      fixture.detectChanges();
      let btn = fixture.debugElement.query(By.css('#btn_upload'));
      expect(btn).toBeFalsy();
      btn = fixture.debugElement.query(By.css('#btn_download'));
      expect(btn).toBeTruthy();
      btn = fixture.debugElement.query(By.css('#btn_delete'));
      expect(btn).toBeTruthy();
    });
  });
});
