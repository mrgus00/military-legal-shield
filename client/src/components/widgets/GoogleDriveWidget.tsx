import { useState, useEffect } from 'react';
import { HardDrive, File, Folder, Download, Share2, Eye, AlertCircle, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  modifiedTime: string;
  webViewLink: string;
  thumbnailLink?: string;
  shared: boolean;
  starred: boolean;
}

export default function GoogleDriveWidget() {
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for demonstration - replace with actual Google Drive API integration
  const mockFiles: DriveFile[] = [
    {
      id: '1',
      name: 'Court Martial Defense Documents',
      mimeType: 'application/vnd.google-apps.folder',
      modifiedTime: '2024-06-24T10:00:00Z',
      webViewLink: 'https://drive.google.com/drive/folders/abc123',
      shared: true,
      starred: true
    },
    {
      id: '2',
      name: 'Power of Attorney Forms.pdf',
      mimeType: 'application/pdf',
      size: '2.4 MB',
      modifiedTime: '2024-06-23T15:30:00Z',
      webViewLink: 'https://drive.google.com/file/d/def456/view',
      shared: false,
      starred: true
    },
    {
      id: '3',
      name: 'VA Benefits Documentation',
      mimeType: 'application/vnd.google-apps.folder',
      modifiedTime: '2024-06-22T09:15:00Z',
      webViewLink: 'https://drive.google.com/drive/folders/ghi789',
      shared: true,
      starred: false
    },
    {
      id: '4',
      name: 'Security Clearance Appeal.docx',
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      size: '1.8 MB',
      modifiedTime: '2024-06-21T14:45:00Z',
      webViewLink: 'https://drive.google.com/file/d/jkl012/view',
      shared: false,
      starred: false
    },
    {
      id: '5',
      name: 'Military Records.zip',
      mimeType: 'application/zip',
      size: '15.7 MB',
      modifiedTime: '2024-06-20T11:20:00Z',
      webViewLink: 'https://drive.google.com/file/d/mno345/view',
      shared: true,
      starred: false
    }
  ];

  useEffect(() => {
    // Initialize with mock data for demonstration
    setFiles(mockFiles);
    setIsConnected(true);
  }, []);

  const connectToGoogleDrive = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real implementation, this would initiate OAuth flow
      // For now, we'll simulate connection
      setTimeout(() => {
        setIsConnected(true);
        setFiles(mockFiles);
        setLoading(false);
      }, 1500);
    } catch (err) {
      setError('Failed to connect to Google Drive');
      setLoading(false);
    }
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType === 'application/vnd.google-apps.folder') {
      return <Folder className="h-4 w-4 text-blue-600" />;
    }
    return <File className="h-4 w-4 text-gray-600" />;
  };

  const getFileType = (mimeType: string) => {
    if (mimeType === 'application/vnd.google-apps.folder') return 'Folder';
    if (mimeType === 'application/pdf') return 'PDF';
    if (mimeType.includes('wordprocessingml')) return 'Word';
    if (mimeType.includes('spreadsheetml')) return 'Excel';
    if (mimeType === 'application/zip') return 'ZIP';
    return 'File';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isConnected) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <HardDrive className="h-5 w-5 text-green-600" />
            Google Drive
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-8">
            <HardDrive className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">
              Connect your Google Drive to access legal documents and files
            </p>
            <Button 
              onClick={connectToGoogleDrive}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Connecting...
                </>
              ) : (
                <>
                  <HardDrive className="h-4 w-4 mr-2" />
                  Connect Google Drive
                </>
              )}
            </Button>
          </div>
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-lg">
            <HardDrive className="h-5 w-5 text-green-600" />
            Legal Documents
          </div>
          <Badge variant="secondary" className="text-xs">
            Connected
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Input
          placeholder="Search files and folders..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="h-8 text-sm"
        />
        
        <div className="max-h-80 overflow-y-auto space-y-2">
          {filteredFiles.length === 0 ? (
            <div className="text-center py-6">
              <File className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">
                {searchTerm ? 'No files match your search' : 'No files found'}
              </p>
            </div>
          ) : (
            filteredFiles.map((file) => (
              <div
                key={file.id}
                className="border rounded-lg p-3 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2 flex-1 min-w-0">
                    {getFileIcon(file.mimeType)}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{file.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {getFileType(file.mimeType)}
                        </Badge>
                        {file.size && (
                          <span className="text-xs text-gray-500">{file.size}</span>
                        )}
                        {file.shared && (
                          <Badge variant="secondary" className="text-xs">
                            <Share2 className="h-3 w-3 mr-1" />
                            Shared
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Modified {formatDate(file.modifiedTime)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {file.starred && (
                      <div className="w-2 h-2 bg-yellow-400 rounded-full" title="Starred" />
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => window.open(file.webViewLink, '_blank')}
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="pt-2 border-t flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => window.open('https://drive.google.com', '_blank')}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Open Drive
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => window.open('https://drive.google.com/drive/u/0/my-drive', '_blank')}
          >
            <Download className="h-4 w-4 mr-2" />
            Upload Files
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}