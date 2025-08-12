"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Page4567Props {
  currentSection?: string;
}

const steps = [
  { id: "01", name: "D1-D2", time: 0.5 },
  { id: "02", name: "D3-Containment", time: 0.5 },
  { id: "03", name: "D3-Alert&Awareness", time: 0.5 },
  { id: "04", name: "D4-Investigation Sheet", time: 1 },
  { id: "05", name: "D4-Root Cause Analysis", time: 1 },
  { id: "06", name: "D5-Corrective Actions", time: 0.5 },
  { id: "07", name: "D6-Effectiveness control", time: 5 },
  { id: "08", name: "D7-Prevention", time: 0.5 },
  { id: "09", name: "NC Spools Follow-up & NQ Cost", time: 0.5 },
];

interface Page4567Props {
  currentSection?: string;
}

export default function Page4567({ currentSection }: Page4567Props) {
  return (
    <div className="space-y-8 p-6">
      {/* 8D Process Dashboard */}
      <Card className="border-2">
        <CardHeader className="bg-blue-900 text-white">
          <div className="flex justify-between items-center">
            <CardTitle>8D Process Dashboard</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="bg-yellow-100 p-2 text-center font-semibold">
              8D Methodology Steps Follow-up
              <span className="float-right">Steps Time</span>
            </div>

            {steps.map((step) => (
              <div key={step.id} className="flex items-center gap-4">
                <div className="w-8">{step.id}</div>
                <div className="flex-1 bg-blue-50 p-2">{step.name}</div>
                <div className="w-12 bg-gray-200 text-center">{step.time}</div>
              </div>
            ))}

            <div className="mt-4">
              <div className="bg-yellow-100 p-2 text-center font-semibold">
                Global Progress
                <span className="float-right">10</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Planning Table */}
      <Card className="border-2">
        <CardHeader className="bg-blue-900 text-white p-2">
          <div className="flex justify-end">
            <Label className="text-white">Issue Date:</Label>
            <Input
              className="w-24 ml-2 h-6 bg-white"
              defaultValue="26/09/2023"
            />
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="bg-yellow-100">Planning</TableHead>
                <TableHead className="bg-yellow-100">Closing Date</TableHead>
                <TableHead className="bg-yellow-100">Follow-Up</TableHead>
                <TableHead className="bg-yellow-100">Progress</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 10 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell className="bg-gray-200">
                    <Input className="h-6" type="date" />
                  </TableCell>
                  <TableCell className="bg-gray-200">
                    <Input className="h-6" type="date" />
                  </TableCell>
                  <TableCell className="bg-gray-200">
                    <Input className="h-6" />
                  </TableCell>
                  <TableCell className="bg-gray-200">
                    <Input
                      className="h-6"
                      type="number"
                      min="0"
                      max="100"
                      defaultValue="0"
                    />
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell className="font-bold">Cumulative</TableCell>
                <TableCell></TableCell>
                <TableCell className="bg-gray-300">-4.5</TableCell>
                <TableCell className="bg-blue-100">11%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-bold">Average Delay</TableCell>
                <TableCell></TableCell>
                <TableCell className="bg-gray-300">-4.5</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Team Assembly Form */}
      <Card className="border-2">
        <CardHeader className="bg-blue-900 text-white">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div>
                <span className="font-bold">1D</span>
                <span className="mx-2">-</span>
                <span className="font-bold">8D</span>
              </div>
            </div>
            <CardTitle>TEAM ASSEMBLED</CardTitle>
            <div className="text-sm">
              <div>Issue Date: {new Date().toLocaleDateString()}</div>
              <div>Progress Rate: 100%</div>
              <div>Closing Date: 06/02/2024</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 p-4">
            <div className="space-y-4">
              <div>
                <Label>Customer Incident Name</Label>
                <Input />
              </div>
              <div>
                <Label>Incident Type</Label>
                <Input className="bg-red-100" defaultValue="Claim" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Customer</Label>
                  <Input />
                </div>
                <div>
                  <Label>From</Label>
                  <Input />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Tel</Label>
                  <Input />
                </div>
                <div>
                  <Label>E-mail</Label>
                  <Input />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>ID Number</Label>
                  <Input />
                </div>
                <div>
                  <Label>Reference</Label>
                  <Input />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Color</Label>
                  <Input />
                </div>
                <div>
                  <Label>Rejected Quantity (m)</Label>
                  <Input type="number" />
                </div>
              </div>
              <div>
                <Label>Production Date</Label>
                <Input type="date" />
              </div>
            </div>
          </div>

          {/* Team Members Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Department</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Function</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 8 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Input placeholder="Department" />
                  </TableCell>
                  <TableCell>
                    <Input placeholder="Name" />
                  </TableCell>
                  <TableCell>
                    <Input placeholder="Function" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Problem Description */}
          <div className="mt-4 space-y-4">
            <div>
              <Label>Customer Description</Label>
              <Input className="h-24" />
            </div>
            <div className="space-y-2">
              <Label>Defect Samples:</Label>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Label>Did we receive a sample from Customer?</Label>
                  <RadioGroup defaultValue="no" className="flex">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="yes" />
                      <Label htmlFor="yes">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="no" />
                      <Label htmlFor="no">No</Label>
                    </div>
                  </RadioGroup>
                </div>
                <Input className="w-32" placeholder="When?" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Criticality Form */}
      <Card className="border-2">
        <CardHeader className="bg-blue-900 text-white">
          <div className="flex justify-between items-center">
            <CardTitle>Criticality of the customer incident</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="bg-green-700 text-white">
                  Incident type
                </TableHead>
                <TableHead>Customer impact</TableHead>
                <TableHead>Special characteristic</TableHead>
                <TableHead>
                  Number of impacted customers by the incident
                </TableHead>
                <TableHead>Potential escalation</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="bg-yellow-100">
                  <Input defaultValue="Claim" />
                </TableCell>
                <TableCell>
                  <Input defaultValue="Direct customer process" />
                </TableCell>
                <TableCell className="bg-red-100">
                  <Input defaultValue="1" />
                </TableCell>
                <TableCell className="bg-green-100">
                  <Input defaultValue="1" />
                </TableCell>
                <TableCell className="bg-green-100">
                  <Input defaultValue="Non" />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <Table className="mt-4">
            <TableHeader>
              <TableRow>
                <TableHead>Special characteristic</TableHead>
                <TableHead>
                  Number of impacted customers by the incident
                </TableHead>
                <TableHead>Customer impact</TableHead>
                <TableHead>Result</TableHead>
                <TableHead>Criticality classification</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 4 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Input defaultValue={`Different from ${index + 1}`} />
                  </TableCell>
                  <TableCell>
                    <Input defaultValue="1-2" />
                  </TableCell>
                  <TableCell>
                    <Input defaultValue="Different from 'End of CoP'" />
                  </TableCell>
                  <TableCell>
                    <Input
                      defaultValue={`Total calculated points ${index + 1}`}
                    />
                  </TableCell>
                  <TableCell
                    className={index < 2 ? "bg-red-100" : "bg-green-100"}
                  >
                    <Input />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="bg-gray-100 p-2">
              <Label>Total calculated points:</Label>
              <Input defaultValue="14" />
            </div>
            <div className="bg-red-100 p-2">
              <Label>Criticality classification</Label>
              <Input />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
