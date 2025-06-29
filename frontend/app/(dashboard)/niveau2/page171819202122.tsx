"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image"
import coficabLogo from "../../public/coficab-logo.png"

export default function Page171819202122() {
  return (
    <div className="space-y-8 p-6">
      {/* Step 3 - Potential Causes Validation */}
      <Card className="border-2">
        <CardContent className="p-4">
          <div className="bg-gray-200 p-2 text-center font-semibold mb-4">
            Step 3 - Potential Causes Validation & Defect Reproduction
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Trial No.</TableHead>
                <TableHead>Causes</TableHead>
                <TableHead>Trial Description</TableHead>
                <TableHead>Waiting Result</TableHead>
                <TableHead>Parameters</TableHead>
                <TableHead>Tools</TableHead>
                <TableHead>Pilote & Date</TableHead>
                <TableHead>Result/Conclusion</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 8 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell className="bg-blue-100">{index + 1}</TableCell>
                  <TableCell><Input /></TableCell>
                  <TableCell><Input /></TableCell>
                  <TableCell><Input /></TableCell>
                  <TableCell><Input /></TableCell>
                  <TableCell><Input /></TableCell>
                  <TableCell><Input /></TableCell>
                  <TableCell><Input /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Step 2 - Finding Root Causes */}
      <Card className="border-2">
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="border p-2">
              <Label>Trials Results with details</Label>
              <Textarea className="mt-2 h-20" />
            </div>

            <div className="bg-gray-200 p-2 text-center font-semibold">
              Step 2 - Finding Root Causes (Tools: 5 Whys)
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead rowSpan={2} className="bg-blue-100">Occurrence</TableHead>
                  <TableHead>Potential causes</TableHead>
                  <TableHead>Why1</TableHead>
                  <TableHead>Why2</TableHead>
                  <TableHead>Why3</TableHead>
                  <TableHead>Why4</TableHead>
                  <TableHead>Why5</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 3 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><Input /></TableCell>
                    <TableCell><Input /></TableCell>
                    <TableCell><Input /></TableCell>
                    <TableCell><Input /></TableCell>
                    <TableCell><Input /></TableCell>
                    <TableCell><Input /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Table className="mt-4">
              <TableHeader>
                <TableRow>
                  <TableHead rowSpan={2} className="bg-yellow-100">Non Detection</TableHead>
                  <TableHead>Potential causes</TableHead>
                  <TableHead>Why1</TableHead>
                  <TableHead>Why2</TableHead>
                  <TableHead>Why3</TableHead>
                  <TableHead>Why4</TableHead>
                  <TableHead>Why5</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 3 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><Input /></TableCell>
                    <TableCell><Input /></TableCell>
                    <TableCell><Input /></TableCell>
                    <TableCell><Input /></TableCell>
                    <TableCell><Input /></TableCell>
                    <TableCell><Input /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Table className="mt-4">
              <TableHeader>
                <TableRow>
                  <TableHead rowSpan={2} className="bg-green-100">Systemic</TableHead>
                  <TableHead>Potential causes</TableHead>
                  <TableHead>Why1</TableHead>
                  <TableHead>Why2</TableHead>
                  <TableHead>Why3</TableHead>
                  <TableHead>Why4</TableHead>
                  <TableHead>Why5</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 3 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><Input /></TableCell>
                    <TableCell><Input /></TableCell>
                    <TableCell><Input /></TableCell>
                    <TableCell><Input /></TableCell>
                    <TableCell><Input /></TableCell>
                    <TableCell><Input /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Step 4 - Selected Root Causes */}
            <div className="bg-gray-200 p-2 text-center font-semibold">
              Step 4 - Selected Root Causes
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="bg-blue-200 p-2 text-center">ROOT CAUSES OF OCCURRENCE</div>
                <div className="space-y-2 mt-2">
                  <div className="bg-gray-200 p-1">OC1</div>
                  <div className="bg-gray-200 p-1">OC3</div>
                </div>
              </div>
              <div>
                <div className="bg-yellow-200 p-2 text-center">ROOT CAUSES OF NON-DETECTION</div>
                <div className="space-y-2 mt-2">
                  <div className="bg-gray-200 p-1">ND1</div>
                  <div className="bg-gray-200 p-1">ND3</div>
                </div>
              </div>
              <div>
                <div className="bg-green-200 p-2 text-center">SYSTEMIC ROOT CAUSES</div>
                <div className="space-y-2 mt-2">
                  <div className="bg-gray-200 p-1">SC1</div>
                  <div className="bg-gray-200 p-1">SC3</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-gray-200 p-1">OC2</div>
              <div className="bg-gray-200 p-1">ND2</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-200 p-1">OC4</div>
              <div className="bg-gray-200 p-1">ND4</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-200 p-1">SC2</div>
              <div className="bg-gray-200 p-1">CS4</div>
            </div>

            <div className="flex items-center gap-4 mt-4">
              <Label>Customer Care Supervisor Validation</Label>
              <div className="flex items-center gap-2">
                <Checkbox id="yes" />
                <Label htmlFor="yes">Yes</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="no" />
                <Label htmlFor="no">No</Label>
              </div>
              <Input className="w-32" placeholder="When" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* D5 - Identify Solutions, Corrective Actions */}
      <Card className="border-2">
        <CardHeader className="bg-blue-900 text-white">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Image src={coficabLogo} alt="COFICAB" width={32} height={32} className="object-contain" />
              <span>5D</span>
            </div>
            <CardTitle>Identify Solutions, Corrective Actions</CardTitle>
            <div className="flex items-center gap-4">
              <Label className="text-white">Issue Date:</Label>
              <Input className="w-32 bg-white" />
              <Image src={coficabLogo} alt="Home" width={24} height={24} className="object-contain" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-blue-900 text-white p-2">
              <div>D5 - Identify Solutions, Corrective Actions</div>
              <div className="flex items-center gap-4">
                <div>Actions Plan Global Progress: #DIV/0!</div>
                <div>Progress Rate: 0%</div>
                <div>Closing Date: --/--/----</div>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Root Cause</TableHead>
                  <TableHead>N°</TableHead>
                  <TableHead>Actions Intitulé</TableHead>
                  <TableHead>Pilote</TableHead>
                  <TableHead>Deadline Date</TableHead>
                  <TableHead>Week</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Postpone</TableHead>
                  <TableHead>Follow-up Comments & Progress</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="bg-blue-100">OC</TableCell>
                  <TableCell><Input /></TableCell>
                  <TableCell><Input /></TableCell>
                  <TableCell><Input /></TableCell>
                  <TableCell><Input type="date" /></TableCell>
                  <TableCell>0</TableCell>
                  <TableCell><Input type="number" defaultValue="0" /></TableCell>
                  <TableCell><Input /></TableCell>
                  <TableCell><Input /></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="bg-red-100 border-2 border-red-500">SC</TableCell>
                  <TableCell><Input /></TableCell>
                  <TableCell><Input /></TableCell>
                  <TableCell><Input /></TableCell>
                  <TableCell><Input type="date" /></TableCell>
                  <TableCell>0</TableCell>
                  <TableCell><Input type="number" defaultValue="0" /></TableCell>
                  <TableCell><Input /></TableCell>
                  <TableCell><Input /></TableCell>
                </TableRow>
                {Array.from({ length: 9 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><Input /></TableCell>
                    <TableCell><Input /></TableCell>
                    <TableCell><Input /></TableCell>
                    <TableCell><Input /></TableCell>
                    <TableCell><Input type="date" /></TableCell>
                    <TableCell>0</TableCell>
                    <TableCell><Input type="number" defaultValue="0" /></TableCell>
                    <TableCell><Input /></TableCell>
                    <TableCell><Input /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="mt-4">
              <Label>Conclusion/Comments</Label>
              <Textarea className="mt-2 h-32" />
            </div>

            <div className="flex items-center gap-4 mt-4">
              <Label>Customer Care Supervisor Validation</Label>
              <div className="flex items-center gap-2">
                <Checkbox id="yes2" />
                <Label htmlFor="yes2">Yes</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="no2" />
                <Label htmlFor="no2">No</Label>
              </div>
              <Input className="w-32" placeholder="When" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* D8+1 - Suspect Spools Follow-up & NQ Cost */}
      <Card className="border-2">
        <CardHeader className="bg-blue-900 text-white">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Image src={coficabLogo} alt="COFICAB" width={32} height={32} className="object-contain" />
              <span>8D+1</span>
            </div>
            <CardTitle>Suspect Spools Follow-up & NQ Cost</CardTitle>
            <div className="flex items-center gap-4">
              <Label className="text-white">Issue Date:</Label>
              <Input className="w-32 bg-white" />
              <Image src={coficabLogo} alt="Home" width={24} height={24} className="object-contain" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-blue-900 text-white p-2">
              <div>D8+1 - 8D Acceptance</div>
              <div className="flex items-center gap-4">
                <div>Progress Rate: 0%</div>
                <div>Closing Date: --/--/----</div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Label>Have the 8D been accepted by the Customer?</Label>
              <div className="flex items-center gap-2">
                <Checkbox id="yes3" />
                <Label htmlFor="yes3">Yes</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="no3" />
                <Label htmlFor="no3">No</Label>
              </div>
              <Input className="w-32" placeholder="When" />
            </div>

            <div>
              <Label>If Not, Why</Label>
              <Textarea className="mt-2 h-20" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="bg-blue-100 p-2">Incident Details</div>
                <div className="space-y-2 mt-2">
                  <div className="grid grid-cols-2 gap-2">
                    <Label>Customer Incident Number:</Label>
                    <Input defaultValue="0" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Label>Incident Type:</Label>
                    <Input className="bg-red-100" defaultValue="Claim" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Label>Customer Incident:</Label>
                    <Input defaultValue="0" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Label>ID Number:</Label>
                    <Input defaultValue="0" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Label>Reference:</Label>
                    <Input defaultValue="0" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Label>Color:</Label>
                    <Input defaultValue="0" />
                  </div>
                </div>
              </div>
              <div>
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <Label>Incident Date:</Label>
                    <Input defaultValue="40331" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Label>Customer:</Label>
                    <Input defaultValue="0" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Label>Rejected Quantity (m):</Label>
                    <Input defaultValue="0" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Label>Received Quantity:</Label>
                    <Input defaultValue="03/01/1900" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Label>Prod. Date:</Label>
                    <Input defaultValue="03/01/1900" />
                  </div>
                </div>
              </div>
            </div>

            {/* Non-Quality Cost */}
            <div>
              <div className="bg-blue-100 p-2">Non-Quality Cost</div>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <Label>Replacement Cost:</Label>
                    <Input defaultValue="0.00 €" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Label>Cost of Sorting:</Label>
                    <Input defaultValue="0.00 €" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Label>Cost of Rework:</Label>
                    <Input defaultValue="0.00 €" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Label>Production Line Stopped:</Label>
                    <Input defaultValue="0.00 €" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Label>Scrapped Finished Goods:</Label>
                    <Input defaultValue="0.00 €" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <Label>Scrapped Purchased Parts:</Label>
                    <Input defaultValue="0.00 €" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Label>Test Costs:</Label>
                    <Input defaultValue="0.00 €" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Label>Overtime Labor:</Label>
                    <Input defaultValue="0.00 €" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Label>Special Freights:</Label>
                    <Input defaultValue="0.00 €" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Label>Other Costs:</Label>
                    <Input defaultValue="1 000.00 €" />
                  </div>
                </div>
              </div>

              <div className="mt-4 bg-red-100 p-2">
                <div className="text-center font-bold">Total Non Quality Cost</div>
                <div className="text-center text-2xl font-bold">1 000.00 €</div>
              </div>
            </div>

            {/* 8D Closure */}
            <div>
              <div className="bg-blue-900 text-white p-2">8D Closure</div>
              <div className="grid grid-cols-3 gap-4 mt-2">
                <div>
                  <Label>Cost Care Supervisor:</Label>
                  <Input />
                </div>
                <div>
                  <Label>Dept Qty Supervisor:</Label>
                  <Input />
                </div>
                <div>
                  <Label>Plant Quality Manager:</Label>
                  <Input />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
