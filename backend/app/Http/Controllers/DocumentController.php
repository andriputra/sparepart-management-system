<?php

namespace App\Http\Controllers;
use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class DocumentController extends Controller {
    public function store(Request $r) {
        $doc = Document::create([
            'document_number' => 'DOC-'.Str::upper(Str::random(6)),
            'type' => $r->type,
            'created_by' => $r->user()->id,
        ]);
        return response()->json($doc);
    }

    public function saveStep(Request $r, Document $document, $step) {
        $data = $r->all();
        $docData = $document->data ?? [];
        $docData[$step] = $data;
        $document->update(['data'=>$docData,'status'=>'in_progress']);
        return response()->json(['ok'=>true]);
    }

    public function preview(Document $document) {
        return response()->json($document->data);
    }

    public function submit(Document $document) {
        $document->update(['status'=>'submitted']);
        return response()->json(['ok'=>true]);
    }
}