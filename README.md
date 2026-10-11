# Stat Lab

A static, source-based study desk for the CSD3241 midterm on 13 October 2026. Exam scope is Weeks 1–5; moment-generating functions and Week 6 are excluded from practice.

## Use

- **Question bank:** filter by lecture week, topic, source type, specific document, difficulty, and progress. Every question identifies its original document, PDF page, and question number.
- **Guided practice:** answer first, reveal recognition cues, then follow the reason and calculation at each step. Reference buttons open the actual lecture page in a side panel.
- **Method playbook:** learn the reusable process and common traps for each method.
- **Lecture library:** original lecture, formula-sheet, and selected practice-source pages rendered as images for consistent tablet support. References use PDF page numbers. The unabridged Week 5 lecture marks MGF pages outside scope.
- **Scratchpads:** draw with a stylus, touch, or mouse; choose pen color, erase, undo, export PNG, and add typed notes. Saved per question in this browser.
- **Mock midterm:** balanced random questions from all five weeks, or the current filtered pool; 15 or 20 questions in 90 minutes. Answers and deadline survive refresh. Review solutions after submission.
- **My progress:** latest-answer accuracy, coverage, bookmarks, mistakes, exam history, and JSON backup export/import for moving between devices.

Your work is browser-local. It is not stored on GitHub or automatically synced between devices. Export a backup before clearing browser data or switching devices. Import merges progress and scratchpads, with imported records replacing matching questions. Scratchpad images export separately from typed notes; the JSON backup includes both.

## Run locally

Requires Node.js 18 or newer; no dependency installation or build step.

```sh
npm start
```

Open `http://127.0.0.1:4173/ProbabilityAndStatsMidTerms/`.

```sh
npm test
```

The validation checks content schema, unique IDs, source coverage, method links, slide assets, and the MGF exclusion. Numerical calculations were checked during content preparation; extracted source formulas were compared with rendered slides where ambiguous.

## GitHub Pages

Publish the `main` branch from `/(root)` in **Settings → Pages → Deploy from a branch**. All asset and data URLs are relative, so the project works at the repository path. `.nojekyll` disables unnecessary Jekyll processing. No API keys or services are needed.

Site address: `https://criknjw.github.io/ProbabilityAndStatsMidTerms/`

## Content provenance and limits

The supplied lectures, homework reviews, tutorial documents, quizzes, revised quiz solutions, and official formula sheet are the source material. Original source numbers and setups are preserved. Some lecture and tutorial questions are converted into MCQs and labelled as adapted. Tutorial 1 is a handwritten working sheet rather than the original question document: only unambiguous reconstructions are used, with a note identifying that limitation. Its personal details and original image are not published. Raw homework/quiz attempt documents, grades, timestamps, and personal attempt records are not published.

The revised Week 4 quizzes revisit earlier lecture topics. The question's lecture week follows the method being taught, while the source identifies the Week 4 quiz. Week 5 MGF homework/tutorial subparts are omitted. Practice is designed to teach the provided material; it is not a prediction of the exam or a guarantee of marks.

The bank contains 192 worked questions and 49 reusable method guides, with 310 original source pages in the viewer. All in-scope homework questions, readable tutorial problems, supplied pop quizzes, Quiz 1, and both revised quiz solution sets are represented. Unreadable Tutorial 1 Q5.3–5.4 conditions were omitted rather than invented.

`research/` contains local PDF extraction intermediates and is ignored by Git. `scripts/extract_materials.py --source "PATH_TO_PDFS"` and `scripts/render_materials.py --source "PATH_TO_PDFS"` regenerate local content assets using the supplied PDF folder and the bundled Python packages (`pdfplumber`, `pypdfium2`, Pillow). They are preparation tools, not runtime requirements.
