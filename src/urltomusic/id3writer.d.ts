declare module "id3-writer" {
    class FileType {}

    class MetaType {}

    class WriterType {
        setFile(
            file: FileType
        ): {
            write: (meta: any, callback: any) => any;
        };
    }

    const Id3Writer: {
        File: new (path: string) => FileType;
        Meta: new ({
            artist,
            title,
            album,
        }: {
            artist: string;
            title: string;
            album: string;
        }) => MetaType;
        Writer: new () => WriterType;
    };

    export = Id3Writer;
}
