export default interface BulkFolder {
  name: string;
  type: string;
  children?: BulkFolder[];
  files?: File;
}
