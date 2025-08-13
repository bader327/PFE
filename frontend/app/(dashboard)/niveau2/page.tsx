"use client";

import { getUserRoleFromUser } from "@/lib/roleUtils";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";

// Layout Components
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";

// UI Components
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

// Configuration
import { sections } from "./sections";

// Pages
import Page123 from "./page123";
import Page171819202122 from "./page171819202122";
import Page4567 from "./page4567";

export default function Home() {
  // Role-based restrictions: CHEF_ATELIER read-only
  const { user, isLoaded } = useUser();
  const role = getUserRoleFromUser(user);
  const isChefAtelier = role === "CHEF_ATELIER";
  const disableActions = !isLoaded || isChefAtelier;
  const [currentSection, setCurrentSection] = useState("info");
  const [progress, setProgress] = useState<Record<string, number>>(
    Object.fromEntries(sections.map((section) => [section.id, 0]))
  );

  const renderSection = () => {
    switch (currentSection) {
      case "info":
      case "d1-d2":
      case "d3":
        return <Page123 currentSection={currentSection} />;
      case "d4":
      case "d5":
      case "d6":
      case "d7":
        return <Page4567 currentSection={currentSection} />;
      case "d8":
      case "d8-plus":
        return <Page171819202122 currentSection={currentSection} />;
      default:
        return null;
    }
  };

  return (
    <div className="h-screen bg-background">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel
          defaultSize={20}
          minSize={15}
          maxSize={25}
        ></ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel>
          <ScrollArea className="h-screen">
            <div className="flex-1 space-y-6 p-8 pt-6">
              <div className="flex items-center justify-between border-b pb-4">
                <div className="space-y-1">
                  <h2 className="text-3xl font-bold tracking-tight">
                    Rapport 8D
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Système de Gestion de la Qualité
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <Button variant="outline" disabled={disableActions}>
                    Enregistrer
                  </Button>
                  <Button disabled={disableActions}>Exporter PDF</Button>
                </div>
              </div>

              {/* Progress Overview */}
              <Card className="border-2">
                <CardHeader className="pb-3">
                  <CardTitle>Progression du Rapport</CardTitle>
                  <CardDescription>
                    Vue d'ensemble de l'avancement par section
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {sections.map((section) => (
                      <div
                        key={section.id}
                        className={`p-4 border rounded-lg transition-colors cursor-pointer
                          ${
                            currentSection === section.id
                              ? "bg-accent border-primary"
                              : "hover:bg-accent/50"
                          }`}
                        onClick={() => setCurrentSection(section.id)}
                        role="button"
                        tabIndex={0}
                      >
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="font-medium">{section.title}</span>
                          <span className="text-muted-foreground">
                            {progress[section.id]}%
                          </span>
                        </div>
                        <Progress
                          value={progress[section.id]}
                          className="h-2"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Main Content Area (read-only for CHEF_ATELIER) */}
              <div
                className={`space-y-6${isChefAtelier ? " pointer-events-none" : ""}`}
                aria-disabled={isChefAtelier}
              >
                {renderSection()}
              </div>
            </div>
          </ScrollArea>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
