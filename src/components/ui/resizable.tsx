import * as React from "react";
import { Group, Panel, Separator } from "react-resizable-panels";
import { cn } from "@/lib/utils";

export type ResizablePanelGroupProps = React.ComponentPropsWithoutRef<
  typeof Group
>;

const ResizablePanelGroup = ({
  className,
  ...props
}: ResizablePanelGroupProps): React.ReactElement => (
  <Group
    className={cn(
      "flex h-full w-full data-[panel-group-direction=vertical]:flex-col",
      className
    )}
    {...props}
  />
);

const ResizablePanel = Panel;

export type ResizableHandleProps = React.ComponentPropsWithoutRef<
  typeof Separator
> & {
  withHandle?: boolean;
};

const ResizableHandle = ({
  withHandle,
  className,
  ...props
}: ResizableHandleProps): React.ReactElement => (
  <Separator
    className={cn(
      "bg-border relative flex w-px items-center justify-center after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:translate-x-0 data-[panel-group-direction=vertical]:after:translate-y-1/2 first:data-[panel-group-direction=vertical]:h-0 first:data-[panel-group-direction=vertical]:p-0",
      className
    )}
    {...props}
  >
    {withHandle && (
      <div className="bg-border text-muted-foreground bg-background z-10 flex h-4 w-3 items-center justify-center rounded-sm border text-xs">
        ⋮
      </div>
    )}
  </Separator>
);

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };
