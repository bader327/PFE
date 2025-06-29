"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Page123Props {
  currentSection?: string;
}

export default function Page123({ currentSection }: Page123Props) {
  return (
    <div className="space-y-8 p-6">
      {/* IMAGE 1: FPS Analysis Form */}
      <Card className="border-2 border-black">
        <CardHeader className="border-b-2 border-black p-0">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-16 border-2 border-black flex items-center justify-center bg-white">
                <span className="text-lg font-bold text-blue-900">COFICAB</span>
              </div>
              <CardTitle className="text-2xl font-bold">FPS Analysis</CardTitle>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="border border-black p-1">
                <Label className="text-xs">Reference:</Label>
                <Input className="h-6 text-xs border-0 p-1" defaultValue="12.80.07.8D" />
              </div>
              <div className="border border-black p-1">
                <Label className="text-xs">Effective Date:</Label>
                <Input className="h-6 text-xs border-0 p-1" defaultValue="03.05.2024/02" />
              </div>
              <div className="border border-black p-1">
                <Label className="text-xs">Type of Document:</Label>
                <Input className="h-6 text-xs border-0 p-1" defaultValue="Formulaire" />
              </div>
              <div className="border border-black p-1">
                <Label className="text-xs">Page:</Label>
                <Input className="h-6 text-xs border-0 p-1" defaultValue="1/1" />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {/* Description Section */}
          <div className="border-b-2 border-black">
            <h2 className="bg-blue-900 text-white p-2 font-bold">I. DESCRIPTION</h2>
            <div className="p-4 space-y-4">
              <div>
                <Label className="font-bold text-blue-900">Object:</Label>
                <div className="mt-2 p-2 border border-gray-300 min-h-[60px]">
                  <Input 
                    className="border-0 p-0 text-sm"
                    placeholder="Ce formulaire est un modèle utilisé pour traiter les incidents internes et externes."
                  />
                </div>
              </div>
              <div className="text-sm space-y-2">
                <p>Il décrit la méthode utilisée pour éliminer les causes profondes de la non-conformité, il comprend les étapes suivantes :</p>
                <div className="pl-4 space-y-1">
                  <div className="flex items-start space-x-2">
                    <span>•</span>
                    <Input className="border-0 text-sm" placeholder="La constitution de l'équipe de résolution du problème." />
                  </div>
                  <div className="flex items-start space-x-2">
                    <span>•</span>
                    <Input className="border-0 text-sm" placeholder="La description du défaut" />
                  </div>
                  <div className="flex items-start space-x-2">
                    <span>•</span>
                    <Input className="border-0 text-sm" placeholder="L'implantation des actions immédiates" />
                  </div>
                  <div className="flex items-start space-x-2">
                    <span>•</span>
                    <Input className="border-0 text-sm" placeholder="L'identification des causes racines du problème" />
                  </div>
                  <div className="flex items-start space-x-2">
                    <span>•</span>
                    <Input className="border-0 text-sm" placeholder="L'identification des actions correctives permanentes" />
                  </div>
                  <div className="flex items-start space-x-2">
                    <span>•</span>
                    <Input className="border-0 text-sm" placeholder="L'implantation des actions correctives" />
                  </div>
                  <div className="flex items-start space-x-2">
                    <span>•</span>
                    <Input className="border-0 text-sm" placeholder="L'identification des actions préventives" />
                  </div>
                  <div className="flex items-start space-x-2">
                    <span>•</span>
                    <Input className="border-0 text-sm" placeholder="Le jugement et observation relative au rapport 8D." />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Domain Application */}
          <div className="border-b border-black">
            <h2 className="bg-blue-900 text-white p-2 font-bold">DOMAINE D'APPLICATION :</h2>
            <div className="p-2">
              <Input className="border-0 bg-gray-100" placeholder="Problème qualité" />
            </div>
          </div>

          {/* Used By */}
          <div className="border-b border-black">
            <h2 className="bg-blue-900 text-white p-2 font-bold">UTILISÉ PAR :</h2>
            <div className="p-2">
              <Input className="border-0 bg-gray-100" placeholder="Équipe qualité" />
            </div>
          </div>

          {/* Definition of Annotations */}
          <div className="border-b border-black">
            <h2 className="bg-blue-900 text-white p-2 font-bold">DÉFINITION DES ANNOTATIONS :</h2>
            <div className="p-2">
              <Input className="border-0 bg-gray-100" placeholder="RAS" />
            </div>
          </div>

          {/* Change History */}
          <div className="border-b border-black">
            <h2 className="bg-blue-900 text-white p-2 font-bold">II. HISTORIQUE DU CHANGEMENT</h2>
            <Table className="border-collapse">
              <TableHeader>
                <TableRow className="bg-blue-900">
                  <TableHead className="border border-black text-white text-center">DATE DE RÉVISION</TableHead>
                  <TableHead className="border border-black text-white text-center">VERSION</TableHead>
                  <TableHead className="border border-black text-white text-center">MODIFICATION</TableHead>
                  <TableHead className="border border-black text-white text-center">MODIFIÉ PAR</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="border border-black text-center">
                    <Input className="border-0 text-center" defaultValue="06.02.2024" />
                  </TableCell>
                  <TableCell className="border border-black text-center">
                    <Input className="border-0 text-center" defaultValue="01" />
                  </TableCell>
                  <TableCell className="border border-black">
                    <Input className="border-0" defaultValue="1ère émission" />
                  </TableCell>
                  <TableCell className="border border-black">
                    <Input className="border-0" defaultValue="Hatem Chebbi" />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="border border-black text-center">
                    <Input className="border-0 text-center" defaultValue="03.05.2024" />
                  </TableCell>
                  <TableCell className="border border-black text-center">
                    <Input className="border-0 text-center" defaultValue="02" />
                  </TableCell>
                  <TableCell className="border border-black">
                    <Input className="border-0" defaultValue="Ajout de la classification des incidents selon leurs criticités" />
                  </TableCell>
                  <TableCell className="border border-black">
                    <Input className="border-0" defaultValue="Hazem Bououni" />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="border border-black h-8"></TableCell>
                  <TableCell className="border border-black h-8"></TableCell>
                  <TableCell className="border border-black h-8"></TableCell>
                  <TableCell className="border border-black h-8"></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="border border-black h-8"></TableCell>
                  <TableCell className="border border-black h-8"></TableCell>
                  <TableCell className="border border-black h-8"></TableCell>
                  <TableCell className="border border-black h-8"></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Approval Matrix */}
          <div className="border-b border-black">
            <h2 className="bg-blue-900 text-white p-2 font-bold">III. MATRICE D'APPROBATION</h2>
            <Table className="border-collapse">
              <TableHeader>
                <TableRow className="bg-blue-900">
                  <TableHead className="border border-black text-white text-center">Nom</TableHead>
                  <TableHead className="border border-black text-white text-center">Département</TableHead>
                  <TableHead className="border border-black text-white text-center">Fonction</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="border border-black">
                    <Input className="border-0" defaultValue="Hazem Bououni" />
                  </TableCell>
                  <TableCell className="border border-black text-center">
                    <Input className="border-0 text-center" defaultValue="Qualité" />
                  </TableCell>
                  <TableCell className="border border-black">
                    <Input className="border-0" defaultValue="Resp.Qualité Client" />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="border border-black">
                    <Input className="border-0" defaultValue="Hatem Chebbi" />
                  </TableCell>
                  <TableCell className="border border-black text-center">
                    <Input className="border-0 text-center" defaultValue="Qualité" />
                  </TableCell>
                  <TableCell className="border border-black">
                    <Input className="border-0" defaultValue="Chef Dept. Qualité" />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="border border-black">
                    <Input className="border-0" defaultValue="Mohamed Drira" />
                  </TableCell>
                  <TableCell className="border border-black text-center">
                    <Input className="border-0 text-center" defaultValue="Direction usine" />
                  </TableCell>
                  <TableCell className="border border-black">
                    <Input className="border-0" defaultValue="Directeur d'usine" />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <div className="p-2 text-xs">
              <Input className="border-0 text-xs" defaultValue="DDD: 14.6620" />
            </div>
          </div>

          {/* Confidentiality Classification */}
          <div>
            <h2 className="bg-blue-900 text-white p-2 font-bold">IV. CLASSIFICATION DE CONFIDENTIALITÉ</h2>
            <Table className="border-collapse">
              <TableHeader>
                <TableRow>
                  <TableHead className="border border-black text-center text-xs">Extrêmement confidentiel</TableHead>
                  <TableHead className="border border-black text-center text-xs">Confidentiel</TableHead>
                  <TableHead className="border border-black text-center text-xs">Propriété/restreinte</TableHead>
                  <TableHead className="border border-black text-center text-xs">Usage publique</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="border border-black text-center h-8">
                    <Checkbox />
                  </TableCell>
                  <TableCell className="border border-black text-center h-8">
                    <Checkbox defaultChecked />
                  </TableCell>
                  <TableCell className="border border-black text-center h-8">
                    <Checkbox />
                  </TableCell>
                  <TableCell className="border border-black text-center h-8">
                    <Checkbox />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <div className="mt-4 text-center text-xs italic p-4 border-t border-black">
              <p>Ce document est la propriété du groupe COFICAB</p>
              <p>Il ne peut être transmis ou dupliqué par aucun moyen</p>
              <p>que ce soit sous une forme papier ou électronique.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* IMAGE 2: Technical/Systemic Examination Form */}
      <Card className="border-2 border-black">
        <CardHeader className="bg-blue-900 text-white p-2">
          <CardTitle className="text-center">Technical / Systemic Examination</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-12 border-collapse">
            {/* Left side with circles and labels */}
            <div className="col-span-1 border-r border-black">
              <div className="space-y-4 p-2">
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-6 h-6 rounded-full border-2 border-black bg-white flex items-center justify-center">
                    <span className="text-xs">⊕</span>
                  </div>
                  <div className="w-6 h-6 rounded-full border-2 border-black bg-white flex items-center justify-center">
                    <span className="text-xs">⊕</span>
                  </div>
                  <div className="w-6 h-6 rounded-full border-2 border-black bg-white flex items-center justify-center">
                    <span className="text-xs">⊕</span>
                  </div>
                  <div className="w-6 h-6 rounded-full border-2 border-black bg-black flex items-center justify-center">
                    <span className="text-xs text-white">●</span>
                  </div>
                  <div className="w-6 h-6 rounded-full border-2 border-black bg-white flex items-center justify-center">
                    <span className="text-xs">●</span>
                  </div>
                  <div className="w-6 h-6 rounded-full border-2 border-black bg-white flex items-center justify-center">
                    <span className="text-xs">✕</span>
                  </div>
                  <div className="w-6 h-6 rounded-full border-2 border-black bg-white flex items-center justify-center">
                    <span className="text-xs">○</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main content area */}
            <div className="col-span-11">
              <Table className="border-collapse w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="border border-black bg-blue-900 text-white text-xs p-1 writing-mode-vertical">Version</TableHead>
                    <TableHead className="border border-black bg-blue-900 text-white text-xs p-1">1</TableHead>
                    <TableHead className="border border-black bg-blue-900 text-white text-xs p-1">2</TableHead>
                    <TableHead className="border border-black bg-blue-900 text-white text-xs p-1">3</TableHead>
                    <TableHead className="border border-black bg-blue-900 text-white text-xs p-1">4</TableHead>
                    <TableHead className="border border-black bg-blue-900 text-white text-xs p-1">5</TableHead>
                    <TableHead className="border border-black bg-blue-900 text-white text-xs p-1">6</TableHead>
                    <TableHead className="border border-black bg-blue-900 text-white text-xs p-1">7</TableHead>
                    <TableHead className="border border-black bg-blue-900 text-white text-xs p-1">8</TableHead>
                    <TableHead className="border border-black bg-blue-900 text-white text-xs p-1">9</TableHead>
                    <TableHead className="border border-black bg-blue-900 text-white text-xs p-1">10</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* Multiple rows with various input fields and checkboxes */}
                  {Array.from({ length: 20 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell className="border border-black p-1 h-8">
                        <Input className="border-0 h-6 text-xs" />
                      </TableCell>
                      {Array.from({ length: 10 }).map((_, colIndex) => (
                        <TableCell key={colIndex} className="border border-black p-1 h-8 text-center">
                          {index % 3 === 0 ? (
                            <Checkbox className="w-4 h-4" />
                          ) : (
                            <Input className="border-0 h-6 text-xs text-center" />
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Right side header */}
          <div className="absolute top-0 right-0 p-2">
            <div className="text-xs space-y-1">
              <div className="bg-blue-900 text-white p-1 text-center">COFICAB</div>
              <div className="border border-black p-1 text-center">COF TN</div>
              <div className="text-center">8D REPORT</div>
              <div className="text-center text-xs">08.02.2024</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* IMAGE 3: Work Instructions */}
      <Card className="border-2 border-black">
        <CardHeader className="bg-blue-900 text-white p-4">
          <CardTitle className="text-center text-xl">Instructions de Travail pour le Traitement des Incidents Clients</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Step 1 */}
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center font-bold">1</div>
              <div className="flex-1">
                <h3 className="font-bold text-blue-900 mb-2">1. Réception de l'Incident Client :</h3>
                <div className="space-y-2 text-sm">
                  <p>L'ingénieur Qualité Client (IQC) doit veiller à ce que toutes les informations pertinentes sur l'incident soient correctement documentées dans la base de suivi des incidents. Cela comprend :</p>
                  <div className="pl-4 space-y-1">
                    <p>- La date et l'heure de réception de l'incident.</p>
                    <p>- Les coordonnées du client (nom, entreprise, contact).</p>
                    <p>- Une description détaillée de l'incident, y compris les symptômes, les impacts et toute autre information pertinente.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center font-bold">2</div>
              <div className="flex-1">
                <h3 className="font-bold text-blue-900 mb-2">2. Traitement de l'Incident :</h3>
                <div className="space-y-2 text-sm">
                  <p>L'IQC doit s'assurer que la fiche de suivi des étapes du 8D est correctement renseignée dès le début du processus.</p>
                  <p>L'envoi d'un e-mail aux parties concernées doit contenir des informations claires sur l'incident et ses implications. Les pièces jointes, telles que l'onglet "D1-D2 / D3", doivent être clairement identifiées et accessibles.</p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center font-bold">3</div>
              <div className="flex-1">
                <h3 className="font-bold text-blue-900 mb-2">3. Création du Dossier de Travail sur OneDrive :</h3>
                <div className="space-y-2 text-sm">
                  <p>L'IQC doit créer un dossier de travail de manière logique et structurée, en créant des sous-dossiers pour chaque phase du traitement de l'incident.</p>
                  <p>Il est important de l'équipe d'accès au dossier OneDrive uniquement aux membres autorisés de l'équipe pour garantir la confidentialité et la sécurité des informations.</p>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center font-bold">4</div>
              <div className="flex-1">
                <h3 className="font-bold text-blue-900 mb-2">4. Sécurisation de l'Incident (Containment) :</h3>
                <div className="space-y-2 text-sm">
                  <p>L'IQC doit collaborer étroitement avec le responsable qualité de la zone et son équipe pour élaborer des actions de containment efficaces qui visent à stabiliser la situation et à prévenir tout impact supplémentaire.</p>
                  <p>L'alerte qualité envoyée doit fournir des instructions claires sur les mesures de containment mises en place et les actions nécessaires à suivre.</p>
                </div>
              </div>
            </div>

            {/* Step 5 */}
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center font-bold">5</div>
              <div className="flex-1">
                <h3 className="font-bold text-blue-900 mb-2">5. Réunion de Traitement :</h3>
                <div className="space-y-2 text-sm">
                  <p>Après l'étape du containment, le responsable qualité de chaque zone doit :</p>
                  <div className="pl-4 space-y-1">
                    <p>- Procéder immédiatement au traitement de la non-conformité.</p>
                    <p>- Remplir les annexes D4-1, D4-2 et D4-3 pour obtenir toutes les informations relatives à la bobine défectueuse et au processus.</p>
                  </div>
                  <p>La réunion de traitement doit être soigneusement préparée avec un ordre du jour détaillé, y compris la présentation des données, l'analyse des causes et la discussion des résultats préliminaires de l'analyse.</p>
                  <p>L'IQC et le Responsable Qualité de zone doivent encourager la participation active de tous les personnels concernés pour garantir une compréhension commune de l'incident et des mesures correctives à mettre en œuvre.</p>
                </div>
              </div>
            </div>

            {/* Step 6 */}
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center font-bold">6</div>
              <div className="flex-1">
                <h3 className="font-bold text-blue-900 mb-2">6. Mise à Jour et Suivi :</h3>
                <div className="space-y-2 text-sm">
                  <p>L'IQC doit documenter toutes les activités et les progrès réalisés dans le fichier 8D de manière claire et concise.</p>
                  <p>Les rappels aux personnes en retard dans l'exécution des actions doivent être effectués de manière proactive, en identifiant les obstacles et en fournissant un soutien supplémentaire si nécessaire.</p>
                </div>
              </div>
            </div>

            {/* Step 7 */}
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center font-bold">7</div>
              <div className="flex-1">
                <h3 className="font-bold text-blue-900 mb-2">7. Finalisation du Processus :</h3>
                <div className="space-y-2 text-sm">
                  <p>L'IQC doit s'assurer que toutes les actions préventives sont intégrées de manière appropriée dans les procédures et les processus existants.</p>
                  <p>La révision des documents qualité tels que les FMEA et les instructions de travail doit être mise à jour avec rigueur pour garantir leur pertinence et leur efficacité.</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
