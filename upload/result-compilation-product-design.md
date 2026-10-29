# Result Compilation Web App — Product Design

## 1. Product Overview

The product is a web app for Nigerian secondary schools that automates the compilation of students' termly results.

The main goal is simple: teachers provide the school's assessment scores and other required student information, and the app compiles the data into complete student report cards that can be downloaded or printed.

The app focuses on result compilation. It is not intended to be a complete school management system or a CBT platform.

The app should be usable from a phone. Teachers should be able to upload score files or scan paper score sheets, review the extracted data, and confirm it before the scores are saved.

## 2. Product Goals

- Reduce the time teachers spend calculating and compiling results manually.
- Accept score data in formats teachers can realistically access, including Excel/CSV files and scanned paper score sheets.
- Support different assessment structures used by different teachers or subjects.
- Detect invalid or uncertain data before it becomes part of a student's result.
- Generate a complete, individual report card for each student.
- Let an administrator configure the school and assign responsibilities to teachers.
- Make the app understandable even when the school has not entered any data yet.
- Use realistic Nigerian school structures and fictional demonstration records so the product can be explored before real school data is entered.

## 3. Intended Users

### School Administrator

The administrator configures the school's information and manages the people, classes, subjects, students, assessment rules, and permissions needed for result compilation.

### Teacher

A teacher enters or uploads scores for the classes and subjects assigned to them. A teacher may have more than one responsibility. For example, a teacher may be the form teacher for JSS 1A while also teaching Mathematics in JSS 1, JSS 2, and JSS 3 and Physics in JSS 2 and JSS 3.

### School Leadership

The school may require a designated person, such as the principal or an authorized administrator, to review or approve results before they are released. The exact approval process can be configured to match the school's workflow.

## 4. School Structure and Demonstration Data

The initial demonstration is based on a fictional Nigerian secondary school. Its structure reflects researched Nigerian school practices, while student names and student-level records are fictional.

The demonstration covers:

- JSS 1, JSS 2, and JSS 3.
- SS 1, SS 2, and SS 3.
- Class arms such as JSS 1A and JSS 1B.
- Subjects assigned to the classes that offer them.
- Students enrolled in classes.
- Academic sessions and terms.
- Assessment configurations and sample scores.
- Generated termly report cards.

The subject library is based on Nigerian curriculum references, including NERDC materials. It is a starting point rather than a claim that every school offers every subject. The administrator can adjust the subjects and subject assignments to match the school's actual curriculum and offerings. Junior and senior secondary subject structures may differ.

Demonstration records are clearly distinguished from real school records.

## 5. School Configuration

The administrator manages the school information required for compiling and presenting results.

This includes:

- School name and logo.
- Academic sessions and terms.
- Classes and class arms.
- Subjects and the classes that offer them.
- Student records and class membership.
- Grading boundaries and grade remarks.
- The report card's required fields and presentation.
- Other school-specific result settings.

The configuration should reflect the school's actual practices instead of assuming that every Nigerian school uses identical subjects, grading boundaries, or report card fields.

## 6. Subjects and Classes

The app has a configurable subject library. Subjects can be assigned to the relevant classes, and the administrator can add or adjust subjects to match the school.

The app supports JSS 1 through JSS 3 and SS 1 through SS 3 in the demonstration setup. Each class may have one or more class arms.

A student's results are associated with the correct student, class, subject, term, and academic session. Subjects should only be available for the classes to which they have been assigned.

## 7. Student Records

Student records provide the information needed to match scores to the correct students and generate report cards.

Records may include:

- Student's full name.
- Admission number or another stable student identifier.
- Class and class arm.
- Photograph, if the school requires one.
- Other fields required by the school's report card.

Student records can be managed by the administrator and may be imported in bulk. A stable identifier is important when matching names from uploaded spreadsheets or scanned sheets, because names alone may be ambiguous or misspelled.

## 8. Assessment Structure

The result system uses a 100-mark subject total divided into two major parts:

- **Continuous Assessment (CA): maximum 40 marks.**
- **Final Examination: maximum 60 marks.**

The CA section contains configurable subcolumns. Teachers and subjects do not all use the same number or arrangement of assessments, so the system must not force every subject into one fixed CA structure.

For example, one teacher may use:

| CA component | Maximum mark |
|---|---:|
| Assignment 1 | 5 |
| Assignment 2 | 5 |
| Test 1 | 5 |
| Test 2 | 5 |
| Midterm | 20 |
| **CA maximum** | **40** |
| Examination | 60 |
| **Overall maximum** | **100** |

Another teacher may use four CA components worth 10 marks each. Both structures are valid because the CA components total 40.

Each assessment component has a name and a maximum mark. The configured CA component maximums must total no more than 40, and the examination maximum is 60. A subject's final score is the CA score plus the examination score, for a maximum of 100.

The system validates the assessment configuration and entered scores. A score cannot exceed its component's maximum, the CA total cannot exceed 40, and the examination score cannot exceed 60.

Assessment configuration is associated with the relevant subject, class, term, and academic session as appropriate to the school's workflow. Grading boundaries and grade remarks are configurable rather than hardcoded.

## 9. Result Data Entry and Upload

Teachers need practical ways to provide scores without being forced to use a desktop computer.

The app supports two main input paths:

### Excel/CSV

The teacher can upload a supported spreadsheet containing student identifiers and assessment scores. The system reads the file, matches students and assessment columns, and validates the data.

### Paper Sheet Scanning

The teacher can use a phone to scan or photograph a paper score sheet and upload the resulting image or PDF.

The paper sheet is based on a template generated by the app. This template reflects the selected class, subject, assessment configuration, and student roster. The template helps the system interpret the uploaded sheet.

AI-assisted extraction reads the student information and marks from the scan and creates a draft of the score data. Handwriting and image quality can make extraction uncertain, so the system must not treat every extracted value as correct.

## 10. Generated Templates

The teacher's assessment configuration determines the score-entry template.

The template includes the relevant student list and the configured assessment subcolumns, with their maximum marks. This prevents teachers from having to recreate the structure for each upload.

The app can generate a spreadsheet template for digital entry and a printable PDF template for paper entry.

The PDF is primarily a paper form to be printed, filled in, scanned or photographed, and uploaded. It is not intended to require teachers to manually edit the PDF on their phones.

The generated template is also a reference for interpreting a scanned sheet. After extraction, the teacher sees a draft table that can be checked and corrected before saving.

## 11. Draft Review and Validation

Uploaded spreadsheet data and AI-extracted scan data are reviewed before being saved as verified scores.

The review screen shows the recognized students, assessment components, and marks. It highlights issues such as:

- Unreadable or uncertain marks.
- Scores above the configured maximum.
- CA totals above 40.
- Examination scores above 60.
- Student names or identifiers that cannot be matched.
- Duplicate or conflicting records.
- Missing scores or required fields.

The teacher can correct errors and confirm the draft. AI-extracted scores must not silently become final scores, and uncertain handwriting must not be replaced with guessed marks.

Only after the teacher confirms the reviewed data are the verified scores saved for compilation.

## 12. Result Compilation

Once the required subject scores and student information are available, the system compiles the results.

It calculates the CA total, examination score, and overall score out of 100. It applies the school's configured grading boundaries and remarks. Where the school requires averages, positions, or other summaries, these are calculated according to the school's rules and the available data.

The system should identify incomplete results rather than silently treating missing scores as zero. It should also make clear which subjects or records are still missing before a report card is considered ready.

The result compilation workflow is intended to replace repetitive manual calculation and assembly of report cards.

## 13. Final Student Report Cards

The primary output is a complete termly report card that can be given to an individual student. The output is more than a list of subject totals.

A report card may include, according to the school's actual format:

- School name and logo.
- Academic session and term.
- Student name and admission number.
- Class and class arm.
- Subjects taken.
- Scores for configured CA components, where the school wants them displayed.
- CA total.
- Examination score.
- Overall score out of 100.
- Grade and remark.
- Overall average or class position, if required.
- Attendance, if recorded and required.
- Affective or psychomotor assessments, if used by the school.
- Class teacher's comment.
- Principal's comment.
- Other fields present in the school's report card.

The report card layout and optional sections are configurable because schools may use different formats.

The app generates individual, print-ready or downloadable PDF report cards. It can also support bulk generation for a class so that a teacher does not need to create every report card separately.

The final output is based on compiled results and the school's required information. It should not be released as complete while required data or approvals are missing.

## 14. Users, Responsibilities, and Permissions

The administrator needs a screen for managing teacher accounts and assigning responsibilities. A single role label is not enough to describe how teachers work in a school.

The app distinguishes between:

- **Form-teacher assignment:** The class for which a teacher is responsible as form teacher.
- **Subject-teaching assignment:** The subjects and classes a teacher teaches.
- **Configuration permissions:** Whether a person can change school, subject, assessment, or grading settings.
- **Result permissions:** Whether a person can enter scores, review drafts, compile results, approve results, or publish report cards.

For example, a teacher may be the form teacher for JSS 1A, teach Mathematics in JSS 1, JSS 2, and JSS 3, and teach Physics in JSS 2 and JSS 3. These are separate assignments and must be represented separately.

The administrator assigns each teacher the relevant classes, subjects, and permissions. Teachers should see and manage only the work they are authorized to access. The school can designate an authorized person to approve or publish results where that is part of its workflow.

## 15. Main Screens

The core product is organized around the following screens and areas. The exact number of routes, dialogs, and smaller states may vary during UI design.

### 1. Dashboard

The dashboard provides a summary of the school's result-compilation progress. It shows relevant setup status, pending uploads, drafts needing review, incomplete results, and report cards that are ready or awaiting approval.

The teacher's dashboard is limited to their assigned classes and subjects. The administrator sees school-wide status.

### 2. School Configuration

The administrator manages school information, academic sessions, terms, classes, class arms, and other school-level settings.

### 3. Subjects and Classes

The administrator manages the subject library and assigns subjects to the appropriate classes.

### 4. Students

The administrator manages student records, class membership, and bulk imports.

### 5. Assessment Configuration

Authorized users configure CA subcolumns and their maximum marks, with a CA maximum of 40 and an examination maximum of 60.

### 6. Users and Permissions

The administrator manages teacher accounts, form-teacher assignments, subject-teaching assignments, and permissions for configuration, result entry, review, approval, and publication.

### 7. Upload Results

Teachers select the relevant class, subject, term, and assessment configuration, then upload an Excel/CSV file or a scanned paper sheet.

### 8. Review and Compile

Teachers review imported or AI-extracted scores, correct flagged problems, confirm the data, and compile the results. The workflow makes incomplete or invalid data visible.

### 9. Report Cards

Authorized users view, generate, download, and print individual report cards or generate a class's report cards in bulk.

These are the core product areas, not a claim that the entire interface contains only nine screens. Login, initial setup, confirmation dialogs, previews, error states, and other supporting screens or states may also be needed.

## 16. Empty States and First-Time Use

The app must remain understandable when its database is empty. An empty table should not leave the user wondering what the section does or how to begin.

Each empty state explains:

- What the section is for.
- Why the information is needed.
- What action is available next.

Examples:

- **Classes:** No classes have been configured yet. The next action is to add or import classes.
- **Subjects:** No subjects have been assigned to classes. The next action is to configure subjects.
- **Students:** No students have been added. The next action is to add or import student records.
- **Assessments:** No assessment structure exists for this subject and term. The next action is to configure assessments.
- **Results:** No scores have been uploaded. The next action is to upload a spreadsheet or scan a paper score sheet.
- **Report cards:** Results are not ready because required scores or information are missing. The app explains what remains incomplete.

The dashboard guides the administrator through initial setup and makes the next useful action clear. The demonstration version is prepopulated with fictional data so a new viewer can understand the app without first configuring an entire school.

## 17. Demo Data and Real-World Fit

The demonstration uses a fictional school with realistic school structure and fictional student records. The subject library is based on Nigerian curriculum research, while subject assignments, class arms, assessment structures, and report card fields remain configurable.

The demo includes enough linked data to demonstrate the full workflow: school setup, classes, subjects, students, assessment configuration, score entry, validation, compilation, and final report cards.

The sample data should be internally consistent. Students belong to classes, subjects are assigned to appropriate classes, assessment scores respect their maximum marks, and report cards reflect the underlying scores and configured grading rules.

The demo should not present fictional student information as real school records.

## 18. Product Boundaries

The app is specifically for compiling student results.

It includes the school and user configuration needed to perform that job accurately, score upload and scanning, validation, calculations, and report-card generation.

It is not intended to include a CBT examination platform, fee management, attendance management as a standalone system, a learning management system, or a broad school administration suite. Attendance and other information may appear on a report card when the school requires them, but that does not make the app a full attendance-management product.

## 19. Core End-to-End Workflow

The intended workflow is:

1. The administrator configures the school, academic session, terms, classes, subjects, students, grading rules, and teacher assignments.
2. An authorized teacher selects the class, subject, and term.
3. The teacher uses the assessment structure configured for that work.
4. The app generates a matching spreadsheet template or printable PDF score sheet.
5. The teacher uploads a completed spreadsheet or scans and uploads the paper sheet using a phone.
6. The app extracts and validates the data and presents a reviewable draft.
7. The teacher checks and corrects the draft, then confirms it.
8. The system saves the verified scores and compiles the results.
9. The app identifies missing data and any required approval.
10. Once the results are complete and approved where necessary, the app generates the students' termly report cards as downloadable or printable PDFs.

## 20. Design Principles

- **Simple purpose:** Focus on result compilation and report cards.
- **Flexible assessments:** Different teachers and subjects can use different CA subcolumns while preserving the 40/60 framework.
- **Phone-friendly workflow:** Teachers can complete the main upload, scanning, and review tasks using a phone.
- **Human confirmation:** Imported and AI-extracted scores are reviewed before saving.
- **Configurable school practices:** Subjects, grading boundaries, report card fields, and responsibilities are not assumed to be identical across schools.
- **Clear permissions:** Form-teacher responsibilities, subject assignments, and administrative powers are distinct.
- **Understandable empty states:** Every empty area explains what it is for and how to begin.
- **Realistic demonstration:** Fictional data follows a coherent Nigerian school structure and shows the complete workflow.
- **Reliable outputs:** Report cards are generated from verified scores and clearly indicate when required information is missing.


## 21. Data Layer and Data Transformation

The app must treat result compilation as a controlled data pipeline. Spreadsheet uploads and scanned paper sheets are different input formats, but both must become the same structured, validated result data before they can be compiled.

The database is the source of truth for school configuration, student identity, assessment definitions, verified scores, compilation results, and report-card records. Uploaded files and AI extraction results are source material or drafts; they are not automatically the final result.

### 21.1 Main Data Entities

The data model needs to represent the following concepts:

- **School:** School identity and school-specific settings.
- **Academic session and term:** The period to which student results belong.
- **Class and class arm:** The school level and group, such as JSS 1 and JSS 1A.
- **Student:** Stable student identifier, name, class membership, and required report-card details.
- **Subject:** A subject in the school's subject library.
- **Class-subject assignment:** The subjects offered by each class.
- **User and role:** Administrator, teacher, and other authorized users.
- **Teacher assignment:** A teacher's form-teacher responsibility for a class, separate from the subjects and classes they teach.
- **Assessment configuration:** The assessment structure for a relevant class, subject, term, and session.
- **Assessment component:** A named CA subcolumn with a configured maximum mark, or the examination component.
- **Score submission/import batch:** The upload or scan from which score data was obtained, including its source type and processing status.
- **Score draft:** Extracted or imported scores awaiting review and confirmation.
- **Verified score:** A confirmed score associated with a student, assessment component, and relevant academic context.
- **Compilation result:** Calculated totals, grades, and other summaries derived from verified scores and the applicable rules.
- **Report card:** The generated student-facing result for a particular term and session, including its generation and approval status where applicable.
- **Audit event:** A record of important actions, such as confirming imported scores, correcting a score, changing assessment configuration, or approving a report.

These entities should be related rather than stored as unrelated flat tables. For example, a score must be traceable to the student, subject, assessment component, class, term, session, and source submission.

### 21.2 Input Formats and Their Transformation

The app accepts two main forms of score input.

**Spreadsheet input**

1. The teacher selects the class, subject, term, session, and relevant assessment configuration.
2. The app reads the uploaded Excel or CSV file.
3. Column headings are mapped to the configured assessment components.
4. Student identifiers are matched to existing student records.
5. Cell values are converted into the app's standard data types.
6. The imported rows become a draft for validation and teacher review.

The system should not assume that every spreadsheet has identical column names or column order. It should use the selected configuration and provide a mapping or correction step when the file's columns do not match the expected template.

**Scanned paper input**

1. The teacher selects the relevant class, subject, term, session, and assessment configuration.
2. The teacher uploads a photo, scanned image, or PDF of the completed generated template.
3. Image processing identifies the page and relevant table regions where possible.
4. AI-assisted extraction reads student identifiers, names, assessment columns, and marks.
5. The generated template and configured assessment structure help interpret the scan.
6. Extracted values are converted into the same draft structure used for spreadsheet imports.
7. Uncertain handwriting, unclear cells, missing values, and unmatched students are flagged for review.

The extraction stage must preserve uncertainty. It must not quietly replace unreadable handwriting with an invented score. The teacher must be able to compare the extracted draft with the uploaded scan and correct it before confirmation.

### 21.3 Canonical Internal Score Format

After extraction, both input paths should use one common internal representation. A conceptual score record includes:

- School identifier.
- Academic session and term.
- Class and class arm.
- Student identifier.
- Subject identifier.
- Assessment configuration identifier or version.
- Assessment component identifier.
- Maximum possible mark.
- Extracted or entered score.
- Input source and import batch.
- Extraction confidence or review flag, when applicable.
- Validation status.
- Confirmation status.
- Relevant timestamps and user references.

The canonical format prevents the spreadsheet workflow and scanning workflow from implementing separate calculation rules. They feed the same validation and compilation pipeline.

A score should not be identified only by a student's name or by the order of a row in a spreadsheet. Stable identifiers and explicit relationships are needed to prevent scores from being assigned to the wrong student.

### 21.4 Normalization and Data Cleaning

Normalization converts varied input values into consistent internal data without changing the intended meaning of a score.

Examples include:

- Trimming unnecessary whitespace from names and identifiers.
- Converting numeric text such as `"15"` into a numeric score of `15`.
- Mapping spreadsheet headings to the correct configured assessment components.
- Standardizing supported date and term representations.
- Matching student identifiers to existing records.
- Representing blank, unreadable, absent, and not-yet-entered scores as distinct states where the school's rules require the distinction.

A blank cell must not automatically become zero. Zero is a real score; a blank may mean missing data, an unreadable value, or another status. The system must preserve that distinction until the teacher resolves it.

Normalization must not silently change student identity, alter marks to fit a maximum, or guess a missing value.

### 21.5 Validation Stages

Validation happens at more than one stage.

**File-level validation**
- The file format is supported and readable.
- Required columns or template fields can be identified.
- The selected class, subject, term, and session are known.
- The file is not an accidental duplicate import without a clear resolution.

**Identity and relationship validation**
- Each student can be matched reliably to the selected class.
- The subject is assigned to the relevant class.
- The teacher is authorized to submit scores for that work.
- The assessment components belong to the selected configuration.
- Duplicate student rows or conflicting records are flagged.

**Score validation**
- Every entered score is numeric and within its configured range.
- A CA component does not exceed its own maximum.
- The sum of CA scores does not exceed 40.
- The examination score does not exceed 60.
- The overall subject score cannot exceed 100.
- Missing or uncertain scores are not silently treated as confirmed scores.

**Compilation validation**
- Required subject results and report-card information are available.
- The applicable grading configuration is defined.
- The system can identify incomplete results before presenting a report card as ready.
- Any required review or approval has been completed before publication.

Errors should explain what is wrong and where it occurred. Where possible, the user should be able to correct a row or cell without restarting the entire upload.

### 21.6 Drafts, Confirmation, and Database Storage

Imported and AI-extracted values first exist as a draft. They are not immediately treated as verified scores.

The intended state transition is:

`Uploaded source → Extracted/imported draft → Validation and review → Teacher confirmation → Verified scores`

The app should preserve the source submission and enough processing information to investigate a problem later. Confirming a draft should create or update the relevant verified scores in a controlled operation. A partially failed import must not leave the system in a misleading state where some rows appear saved and others have silently disappeared.

The database should enforce the relationships and constraints that can reliably be enforced there, in addition to application-level validation. Access rules must prevent a teacher from reading or changing records outside their authorization.

Corrections after confirmation should be traceable. If an assessment configuration changes after scores have been entered, the system should not silently reinterpret historical scores using the new configuration. The applicable configuration or version used for a result must remain identifiable.

### 21.7 Result Calculation and Transformation

Verified component scores are transformed into compiled subject results.

For a subject using the 40/60 framework:

- **CA total:** Sum of the configured CA component scores, with a maximum of 40.
- **Examination score:** The confirmed examination score, with a maximum of 60.
- **Overall subject score:** CA total plus examination score, with a maximum of 100.
- **Grade and remark:** Derived from the grading boundaries configured by the school.
- **Other summaries:** Averages, positions, or other values are calculated only when required and when the necessary data and school rules are available.

For example, if a student receives 4/5, 5/5, 4/5, 4/5, and 16/20 across five CA components, the CA total is 33/40. If the examination score is 48/60, the overall subject score is 81/100.

The system should retain the source component scores so a teacher can understand how the final total was calculated. Compiled values are derived data; they should be reproducible from the verified scores and the applicable assessment and grading configuration.

A change to a verified score or relevant configuration should trigger a controlled recalculation of affected results. The app should make the changed results available for review again where required.

### 21.8 Report-Card Generation

Report-card generation transforms compiled subject results and other required student information into a student-facing document.

The generation process gathers:

- Student identity and class information.
- Academic session and term.
- Compiled subject scores, grades, and remarks.
- Required overall summaries.
- Attendance, behavior, teacher comments, principal comments, or other fields when the school uses them.
- School identity and report-card layout.

The app then produces an individual, print-ready PDF report card. It should also support bulk generation for a class.

The report card must reflect the correct student, class, term, session, and compiled result version. It must not be marked ready when required information is missing or required approval is pending. The system should distinguish a draft, a ready-for-review report, an approved result, and a published or issued report where those states are part of the school's workflow.

If a result is changed after a report card has been generated, the system should make the older document's status clear and generate a new version after the revised result has passed the required checks.

### 21.9 Data Lineage and Traceability

A result must be traceable from the final report card back to the verified subject scores and, where relevant, to the original spreadsheet or scan.

The system should be able to answer:

- Which uploaded file or scan supplied the score?
- Which values were extracted and which were corrected by a user?
- Who confirmed the draft and when?
- Which assessment configuration and grading rules were used?
- How was the final total calculated?
- Who changed or approved a result?
- Which version of the report card was generated from that result?

This history is important for investigating extraction mistakes, resolving disputes, and correcting results responsibly.

### 21.10 Data States

The app should make the state of data visible throughout the workflow. A score submission may be uploaded, processing, awaiting review, invalid, confirmed, or failed. Compiled results may be incomplete, ready for review, approved, or published, depending on the school's workflow.

These states should not be confused. For example, successful file upload does not mean that the scores have been verified, and verified scores do not necessarily mean that the final report cards are approved for release.

### 21.11 Core Data Transformation Flow

The complete data flow is:

`School configuration → Assessment configuration → Template generation → Spreadsheet or scanned paper input → Extraction/import → Canonical score draft → Normalization → Validation → Teacher review and confirmation → Verified scores in the database → Result calculations → Completeness and approval checks → Individual report-card PDFs`

Both spreadsheet and scan inputs converge on the same canonical score draft and the same downstream validation, storage, calculation, and report-generation logic. This keeps the product consistent regardless of how a teacher supplies the scores.
