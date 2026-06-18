#include <iostream> // Includes input and output stream objects such as cin and cout.
#include <vector> // Includes the vector container used to store array elements dynamically.
#include <algorithm> // Includes helper functions such as sort and swap.
using namespace std; // Allows using standard library names without writing std:: every time.
void printArray(const vector<int>& arr) { // Defines a function to print all elements of a vector.
    cout << "Array: "; // Prints a label before displaying the elements.
    for (int value : arr) { // Loops through each element stored in the vector.
        cout << value << " "; // Prints the current element followed by a space.
    } // Ends the loop that prints array elements.
    cout << endl; // Moves the cursor to the next line after printing the array.
} // Ends the printArray function.
vector<int> readArray() { // Defines a function to read array elements from the user.
    int n; // Declares a variable to store the number of elements.
    cout << "Enter number of elements: "; // Asks the user to enter the size of the array.
    cin >> n; // Reads the number of elements entered by the user.
    vector<int> arr(n); // Creates a vector of size n to store the elements.
    cout << "Enter " << n << " elements: "; // Asks the user to enter all array elements.
    for (int i = 0; i < n; i++) { // Runs a loop from index 0 to index n - 1.
        cin >> arr[i]; // Reads one element and stores it at the current index.
    } // Ends the input loop.
    return arr; // Returns the filled vector to the calling function.
} // Ends the readArray function.
void linearSearch(const vector<int>& arr, int key) { // Defines a function to perform linear search.
    for (int i = 0; i < static_cast<int>(arr.size()); i++) { // Checks every element one by one.
        if (arr[i] == key) { // Compares the current array element with the search key.
            cout << key << " found at position " << i + 1 << "." << endl; // Prints the 1-based position if found.
            return; // Stops the function after finding the element.
        } // Ends the if condition for a successful match.
    } // Ends the linear search loop.
    cout << key << " not found in the array." << endl; // Prints this message if the key is not found.
} // Ends the linearSearch function.
void binarySearch(vector<int> arr, int key) { // Defines a function to perform binary search on a copied vector.
    sort(arr.begin(), arr.end()); // Sorts the array because binary search requires sorted data.
    cout << "Sorted "; // Prints a label before showing the sorted array.
    printArray(arr); // Displays the sorted array.
    int low = 0; // Sets the starting index of the search range.
    int high = static_cast<int>(arr.size()) - 1; // Sets the ending index of the search range.
    while (low <= high) { // Repeats while the search range is valid.
        int mid = low + (high - low) / 2; // Calculates the middle index safely.
        if (arr[mid] == key) { // Checks whether the middle element is the required key.
            cout << key << " found at sorted position " << mid + 1 << "." << endl; // Prints the 1-based sorted position.
            return; // Stops the function after finding the key.
        } // Ends the if condition for key found.
        if (arr[mid] < key) { // Checks whether the key is greater than the middle element.
            low = mid + 1; // Searches in the right half of the array.
        } else { // Runs when the key is smaller than the middle element.
            high = mid - 1; // Searches in the left half of the array.
        } // Ends the decision for choosing left or right half.
    } // Ends the binary search loop.
    cout << key << " not found in the array." << endl; // Prints this message if the key is not found.
} // Ends the binarySearch function.
void insertionSort(vector<int>& arr) { // Defines a function to perform insertion sort.
    for (int i = 1; i < static_cast<int>(arr.size()); i++) { // Starts from the second element because the first is already considered sorted.
        int key = arr[i]; // Stores the current element that must be inserted in the correct position.
        int j = i - 1; // Starts checking from the element just before the current element.
        while (j >= 0 && arr[j] > key) { // Moves larger elements one position to the right.
            arr[j + 1] = arr[j]; // Shifts the larger element to the next position.
            j--; // Moves one position left to continue comparison.
        } // Ends the shifting loop.
        arr[j + 1] = key; // Places the key at its correct sorted position.
    } // Ends the main insertion sort loop.
} // Ends the insertionSort function.
void selectionSort(vector<int>& arr) { // Defines a function to perform selection sort.
    for (int i = 0; i < static_cast<int>(arr.size()) - 1; i++) { // Selects the correct element for each position.
        int minIndex = i; // Assumes the current index has the smallest element.
        for (int j = i + 1; j < static_cast<int>(arr.size()); j++) { // Searches the remaining unsorted part of the array.
            if (arr[j] < arr[minIndex]) { // Checks whether a smaller element is found.
                minIndex = j; // Updates the index of the smallest element.
            } // Ends the if condition for finding a smaller element.
        } // Ends the loop that finds the minimum element.
        swap(arr[i], arr[minIndex]); // Places the smallest element at the current position.
    } // Ends the main selection sort loop.
} // Ends the selectionSort function.
int partitionArray(vector<int>& arr, int low, int high) { // Defines a helper function used by quick sort.
    int pivot = arr[high]; // Chooses the last element as the pivot.
    int i = low - 1; // Tracks the position for elements smaller than or equal to the pivot.
    for (int j = low; j < high; j++) { // Loops through the elements before the pivot.
        if (arr[j] <= pivot) { // Checks whether the current element should go before the pivot.
            i++; // Moves the boundary of smaller elements one step forward.
            swap(arr[i], arr[j]); // Swaps the current element into the smaller-elements section.
        } // Ends the if condition for elements less than or equal to pivot.
    } // Ends the partition loop.
    swap(arr[i + 1], arr[high]); // Places the pivot in its correct sorted position.
    return i + 1; // Returns the final position of the pivot.
} // Ends the partitionArray function.
void quickSort(vector<int>& arr, int low, int high) { // Defines a recursive function to perform quick sort.
    if (low < high) { // Continues only when the current part has more than one element.
        int pivotIndex = partitionArray(arr, low, high); // Partitions the array and gets the pivot position.
        quickSort(arr, low, pivotIndex - 1); // Recursively sorts the left part of the pivot.
        quickSort(arr, pivotIndex + 1, high); // Recursively sorts the right part of the pivot.
    } // Ends the if condition for recursive sorting.
} // Ends the quickSort function.
void bubbleSort(vector<int>& arr) { // Defines a function to perform bubble sort.
    for (int i = 0; i < static_cast<int>(arr.size()) - 1; i++) { // Repeats passes over the array.
        bool swapped = false; // Tracks whether any swapping happened in the current pass.
        for (int j = 0; j < static_cast<int>(arr.size()) - i - 1; j++) { // Compares adjacent elements in the unsorted part.
            if (arr[j] > arr[j + 1]) { // Checks whether two adjacent elements are in the wrong order.
                swap(arr[j], arr[j + 1]); // Swaps the adjacent elements to correct their order.
                swapped = true; // Records that a swap happened in this pass.
            } // Ends the if condition for swapping adjacent elements.
        } // Ends the inner bubble sort loop.
        if (!swapped) { // Checks whether the array is already sorted.
            break; // Stops early if no swaps happened in the current pass.
        } // Ends the early-stop condition.
    } // Ends the outer bubble sort loop.
} // Ends the bubbleSort function.
void displayMenu() { // Defines a function to display the menu options.
    cout << "\n===== Search and Sort Menu =====" << endl; // Prints the menu heading.
    cout << "1. Linear Search" << endl; // Prints the option for linear search.
    cout << "2. Binary Search" << endl; // Prints the option for binary search.
    cout << "3. Insertion Sort" << endl; // Prints the option for insertion sort.
    cout << "4. Selection Sort" << endl; // Prints the option for selection sort.
    cout << "5. Quick Sort" << endl; // Prints the option for quick sort.
    cout << "6. Bubble Sort" << endl; // Prints the option for bubble sort.
    cout << "7. Exit" << endl; // Prints the option to exit the program.
    cout << "Enter your choice: "; // Asks the user to choose an option.
} // Ends the displayMenu function.
int main() { // Starts the main function where program execution begins.
    int choice; // Declares a variable to store the user's menu choice.
    do { // Starts a loop that repeats until the user chooses to exit.
        displayMenu(); // Shows the menu to the user.
        cin >> choice; // Reads the user's menu choice.
        if (choice >= 1 && choice <= 6) { // Checks whether the choice is a valid operation.
            vector<int> arr = readArray(); // Reads the array from the user.
            if (choice == 1 || choice == 2) { // Checks whether the selected operation is a search.
                int key; // Declares a variable to store the element to search for.
                cout << "Enter element to search: "; // Asks the user to enter the search element.
                cin >> key; // Reads the search element.
                if (choice == 1) { // Checks whether the user selected linear search.
                    linearSearch(arr, key); // Performs linear search.
                } else { // Runs when the user selected binary search.
                    binarySearch(arr, key); // Performs binary search.
                } // Ends the choice between linear and binary search.
            } else { // Runs when the selected operation is a sorting algorithm.
                cout << "Original "; // Prints a label before showing the original array.
                printArray(arr); // Displays the original array.
                switch (choice) { // Selects the sorting algorithm based on the user's choice.
                    case 3: // Runs when the user selected insertion sort.
                        insertionSort(arr); // Sorts the array using insertion sort.
                        cout << "After Insertion Sort "; // Prints a label for insertion sort result.
                        break; // Exits the switch statement after insertion sort.
                    case 4: // Runs when the user selected selection sort.
                        selectionSort(arr); // Sorts the array using selection sort.
                        cout << "After Selection Sort "; // Prints a label for selection sort result.
                        break; // Exits the switch statement after selection sort.
                    case 5: // Runs when the user selected quick sort.
                        quickSort(arr, 0, static_cast<int>(arr.size()) - 1); // Sorts the whole array using quick sort.
                        cout << "After Quick Sort "; // Prints a label for quick sort result.
                        break; // Exits the switch statement after quick sort.
                    case 6: // Runs when the user selected bubble sort.
                        bubbleSort(arr); // Sorts the array using bubble sort.
                        cout << "After Bubble Sort "; // Prints a label for bubble sort result.
                        break; // Exits the switch statement after bubble sort.
                } // Ends the switch statement.
                printArray(arr); // Prints the sorted array.
            } // Ends the search-or-sort decision.
        } else if (choice == 7) { // Checks whether the user selected exit.
            cout << "Exiting program." << endl; // Prints an exit message.
        } else { // Runs when the user enters an invalid choice.
            cout << "Invalid choice. Please try again." << endl; // Prints an invalid-choice message.
        } // Ends the menu choice validation.
    } while (choice != 7); // Repeats the menu until the user chooses option 7.
    return 0; // Returns 0 to indicate successful program execution.
} // Ends the main function.
