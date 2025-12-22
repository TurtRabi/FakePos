import React, { useState, useEffect } from 'react';
import { useApiConfig } from '@/hooks/useApiConfig';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner'; // Use sonner's toast

export const ApiConfigForm = () => {
  const { config, updateConfig } = useApiConfig();
  const [serviceCodeInput, setServiceCodeInput] = useState(config.serviceCode);
  const [posAppIdInput, setPosAppIdInput] = useState(config.posAppId);
  const [apiUrlInput, setApiUrlInput] = useState(config.apiUrl);
  // No need for `useToast()` here, directly use `toast` from sonner

  useEffect(() => {
    setServiceCodeInput(config.serviceCode);
    setPosAppIdInput(config.posAppId);
    setApiUrlInput(config.apiUrl);
  }, [config]);

  const handleSave = () => {
    updateConfig({ 
      serviceCode: serviceCodeInput, 
      posAppId: posAppIdInput,
      apiUrl: apiUrlInput,
    });
    toast.success("Cấu hình API đã lưu", { // Use sonner's toast.success
      description: "Các cài đặt API đã được cập nhật thành công.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cấu hình API</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="serviceCode">X-Service-Code</Label>
          <Input
            id="serviceCode"
            value={serviceCodeInput}
            onChange={(e) => setServiceCodeInput(e.target.value)}
            placeholder="Nhập mã dịch vụ"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="posAppId">Partner Key</Label>
          <Input
            id="posAppId"
            value={posAppIdInput}
            onChange={(e) => setPosAppIdInput(e.target.value)}
            placeholder="Nhập ID ứng dụng POS"
          />
        </div>
        <Button onClick={handleSave}>Lưu cấu hình</Button>
      </CardContent>
    </Card>
  );
};
