# Import Notion Markdown plugin

This is a built-in plugin for Inkdrop.
This plugin allows you to import notes from Markdown files.
It is originally developed by [q1701](https://github.com/q1701/inkdrop-import-markdown) based on [import-html](https://github.com/inkdropapp/inkdrop-import-html) plugin.
Now based off.

## Todo

- [x] Select root notebook to create export in
- [ ] Give option of skipping already imported files
- [ ] Give real time updates of parsing progress
- [x] Recursively walk through folder
    - [x] Create notebook based on folder, if not exist
- [x] Starting at leaves, import files into folder. 
    - [x] Markdown
        - [x] Import
            - [] Parse `Created` line
            - [] For any local folder link, look at dict and replace with inkdrop link.
        - [] Generate inkdrop link, and take filename as url encoded and store in dict - this will be useful later
        - [] Delete the file?
    - [] CSV (represents tables in Notion)
        - [] Parse as is and replace filepaths (marked by use of double quotes) with inkdrop link
        - [] Convert to Markdown table and store in dict
    - [] Images
        - [] Import
        - [] Generate inkdrop link, and take filename as url encoded and store in dict - this will be useful later
    - [] Non-importable
- [x] Jump up into the parent
- [] Metrics
    - [] Num of markdown files created
    - [] Num of images imported
    - [] Num of CSVs not linked

## How to build

### First time
```
ipm link --dev
```

### Iterations

1. Make code change


## Notes

- Having just done a first run and imported, there are a few issues:
    - Notion tables - I have lots of tiny notes, that represented entries in table
    - I need to make it three passes
        - First pass - 
            - Check if CSV, if so, continue
            - Check for headings - if they are ['Name', 'Created', 'Tags', 'Updated'], that is a Notion list. If NOT a Notion list, continue
            - Identify by markdown file that has same folder name in current folder
            - Check if Same folder name contents is MD, if so, continue
            
- Now that I think about it, why don't I make it a Python script? At least to do all the data conversion into something that Inkdrop can consume
    - I just know Python more!
