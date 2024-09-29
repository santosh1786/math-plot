const fs = require('fs');
const path = require('path');

// Paths to be excluded from the tree structure
const excludedPaths = ['node_modules', 'logs', '.env', '.git','*.png', 'directory_tree.js', 'build', 'directory_tree.txt', 'combined_output.txt', 'package-lock.json', 'package.json', 'README.md', 'README.txt', 'main.js', 'main.py', 'MyLMS.code-workspace'];

// To store the full paths of all files and directories
let fullPathList = [];

/**
 * Recursively generate the directory tree (file and folder names only)
 * @param {string} dirPath - Current directory path
 * @param {string} indent - Current indentation for tree structure
 * @param {string[]} excludedPaths - Paths to exclude from the structure
 * @returns {string} - Directory tree structure (file and folder names only)
 */
const generateTree = (dirPath, indent = '', excludedPaths) => {
    let treeStructure = '';

    // Read the directory contents
    const filesAndDirs = fs.readdirSync(dirPath).filter(fileOrDir => {
        // Exclude specified files/folders
        return !excludedPaths.includes(fileOrDir);
    });

    filesAndDirs.forEach((fileOrDir, index) => {
        const fullPath = path.join(dirPath, fileOrDir);
        const isLast = index === filesAndDirs.length - 1;
        const prefix = isLast ? '└── ' : '├── ';

        // Store full path in the list
        fullPathList.push(fullPath);

        if (fs.statSync(fullPath).isDirectory()) {
            // Add the directory to the tree structure (only folder name)
            treeStructure += `${indent}${prefix}${fileOrDir}/\n`;
            // Recursively generate tree for the directory
            treeStructure += generateTree(fullPath, indent + (isLast ? '    ' : '│   '), excludedPaths);
        } else {
            // Add the file to the tree structure (only file name)
            treeStructure += `${indent}${prefix}${fileOrDir}\n`;
        }
    });

    return treeStructure;
};

// Main function to create the directory tree and full path list
const createDirectoryTree = () => {
    const startDir = process.cwd();  // Starting from current working directory
    const tree = generateTree(startDir, '', excludedPaths);

    // Write the tree structure to a text file
    fs.writeFileSync('directory_tree.txt', tree);

    // Write the full paths to a separate file
    const fullPathOutput = fullPathList.join('\n');
    fs.writeFileSync('full_path_list.txt', fullPathOutput);

    console.log('Directory tree has been written to directory_tree.txt');
    console.log('Full paths of all files and directories have been written to full_path_list.txt');
};

// Run the function
createDirectoryTree();
