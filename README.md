# Import Notion Markdown plugin

This is a built-in plugin for Inkdrop.
This plugin allows you to import notes from Markdown files.
It is originally developed by [q1701](https://github.com/q1701/inkdrop-import-markdown) based on [import-html](https://github.com/inkdropapp/inkdrop-import-html) plugin.
Now based off.

## Todo

- [] Select root notebook to create export in
- [] Recursively walk through folder
    - [] Create notebook based on folder, if not exist
- [] Starting at leaves, import files into folder. 
    - [] Markdown
        - [] Import
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
- [] Jump up into the parent
- [] Metrics
    - [] Num of markdown files created
    - [] Num of images imported
    - [] Num of CSVs not linked

## Notes

- Should use single global dict for filepath to inkdrop link
    - This doesn't work with the CSV files, unless I create the CSVs as separate inkdrop items
        - But is fine if I just replace verbatim on the parsing. That is, instead of storing inkdrop links, I store the actual markdown required for Inkdrop to render those links correctly. So the type of the values is "markdown ready content".