import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Shield, 
  Battery, 
  Bell, 
  Clock, 
  Volume2, 
  Settings as SettingsIcon,
  CheckCircle,
  AlertTriangle,
  ExternalLink,
  RefreshCw,
  Smartphone,
  Info
} from "lucide-react";
import { PermissionsManager, AndroidPermissions } from "@/utils/permissions";
import { Capacitor } from "@capacitor/core";

export const TroubleshootTab = () => {
  const [permissions, setPermissions] = useState<AndroidPermissions | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadPermissions = async () => {
    try {
      const permissionStatuses = await PermissionsManager.getPermissionStatuses();
      setPermissions(permissionStatuses);
    } catch (error) {
      console.error('Failed to load permissions:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadPermissions();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadPermissions();
  };

  const troubleshootingSteps = PermissionsManager.getTroubleshootingSteps();

  const getPermissionIcon = (type: string) => {
    const iconMap: Record<string, typeof Shield> = {
      displayOverApps: Shield,
      batteryOptimization: Battery,
      notifications: Bell,
      exactAlarms: Clock,
      modifyAudioSettings: Volume2,
      systemAlertWindow: Shield,
      wakeLock: Smartphone
    };
    return iconMap[type] || SettingsIcon;
  };

  const getPermissionStatus = (granted: boolean) => {
    return granted ? (
      <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
        <CheckCircle className="h-3 w-3 mr-1" />
        Granted
      </Badge>
    ) : (
      <Badge variant="destructive" className="bg-red-500/20 text-red-400 border-red-500/30">
        <AlertTriangle className="h-3 w-3 mr-1" />
        Required
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-20 bg-muted/20 rounded-lg"></div>
        <div className="h-32 bg-muted/20 rounded-lg"></div>
        <div className="h-64 bg-muted/20 rounded-lg"></div>
      </div>
    );
  }

  const isAndroid = Capacitor.getPlatform() === 'android' || Capacitor.isNativePlatform();

  return (
    <div className="space-y-6">
      {/* Platform Info */}
      <Alert className="border-primary/20 bg-primary/5">
        <Info className="h-4 w-4 text-primary" />
        <AlertDescription className="text-foreground">
          {isAndroid ? (
            <>This troubleshoot guide is optimized for Android devices. Ensure all permissions are granted for reliable alarm functionality.</>
          ) : (
            <>You're viewing this on a web browser. For full alarm functionality, install the app on your Android device.</>
          )}
        </AlertDescription>
      </Alert>

      {/* Quick Actions */}
      <Card className="bg-gradient-card border-border/50 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Permission Status</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {permissions && (
          <div className="grid gap-3">
            {Object.entries(permissions).map(([key, permission]) => {
              const Icon = getPermissionIcon(key);
              return (
                <div
                  key={key}
                  className="flex items-center justify-between p-3 bg-card/30 rounded-lg border border-border/30"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-foreground capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {permission.description}
                      </p>
                    </div>
                  </div>
                  {getPermissionStatus(permission.granted)}
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Troubleshooting Steps */}
      <Card className="bg-gradient-card border-border/50 p-4">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Android Settings Guide
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Follow these steps to ensure your alarm works reliably. Critical permissions are marked as required.
        </p>

        <div className="space-y-3">
          {troubleshootingSteps.map((step, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-card/30 rounded-lg border border-border/30 hover:bg-card/50 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-medium text-foreground">{step.title}</h4>
                  {step.critical && (
                    <Badge variant="destructive" className="text-xs">
                      Required
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={step.action}
                className="ml-4 flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Open Settings
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Additional Tips */}
      <Card className="bg-gradient-card border-border/50 p-4">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Additional Tips
        </h3>
        <div className="space-y-3 text-sm text-muted-foreground">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
            <p>
              <strong className="text-foreground">Device Manufacturer Settings:</strong> Some Android devices (Samsung, Huawei, etc.) have additional battery management settings. Check your device manufacturer's settings app.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
            <p>
              <strong className="text-foreground">Auto-Start Management:</strong> Enable auto-start for this app in your device's security or battery settings to ensure alarms work after device restarts.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
            <p>
              <strong className="text-foreground">Do Not Disturb:</strong> Configure Do Not Disturb settings to allow alarms from this app, or disable DND during your alarm times.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
            <p>
              <strong className="text-foreground">Volume Settings:</strong> Ensure your alarm volume is set high enough and that your device isn't in silent mode during alarm times.
            </p>
          </div>
        </div>
      </Card>

      {/* Test Alarm */}
      <Card className="bg-gradient-card border-border/50 p-4">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Test Your Setup
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          After configuring permissions, test your alarm to ensure it works correctly.
        </p>
        <Button 
          variant="secondary" 
          className="w-full"
          onClick={() => {
            // This would trigger a test alarm
            alert('Test alarm functionality would be triggered here. Set a 1-minute test alarm to verify all permissions work correctly.');
          }}
        >
          <Clock className="h-4 w-4 mr-2" />
          Set Test Alarm (1 minute)
        </Button>
      </Card>

      {/* Emergency Contact */}
      <Alert className="border-border/30 bg-card/20">
        <AlertTriangle className="h-4 w-4 text-yellow-500" />
        <AlertDescription className="text-foreground">
          <strong>Still having issues?</strong> Contact support at{" "}
          <a 
            href="mailto:asuite20@gmail.com?subject=Alarm%20Not%20Working%20-%20Android%20Troubleshoot"
            className="text-primary hover:underline"
          >
            asuite20@gmail.com
          </a>{" "}
          with your device model and Android version.
        </AlertDescription>
      </Alert>
    </div>
  );
};